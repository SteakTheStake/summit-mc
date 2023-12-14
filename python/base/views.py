from django.http import FileResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import PackFile

import requests

import os
import zipfile
import time

import environ

env = environ.Env()


@api_view(["POST"])
def upload_pack(req):
    data = req.data

    try:
        key = data["key"]
        if key == env("KEY"):
            id = data["id"]
            name = data["name"]
            pack = data["pack"]
            uploaded_file = req.FILES.get("pack_file")

            pack_file = PackFile(id=id, name=name, pack=pack, pack_file=uploaded_file)
            pack_file.save()

            return Response({"message": "File uploaded successfully."})
        raise Exception("Unauth")
    except:
        return Response({"message": "Failed to upload."})


@api_view(["POST"])
def get_download(req, pk):
    data = req.data

    try:
        access_token = data["access_token"]
        patreon_id = data["patreon_id"]
        is_pledged = data["is_pledged"]
        pledge_amount = data["pledge_amount"]
        download_file = PackFile.objects.get(id=pk)

        if is_pledged != "true" and int(pledge_amount) < 200:
            raise Exception("Fraudulant data")

        data = {
            "access_token": access_token,
            "patreon_id": patreon_id,
            "is_pledged": is_pledged,
            "pledge_amount": pledge_amount,
            "pack_id": download_file.pack,
            "download_id": pk,
        }

        url = env("API_URL") + "/api/verify-user"
        res = requests.post(url, data=data)
        if res.status_code == 200:
            res_data = res.json()
        elif res_data["error"] == True:
            raise Exception("Can't access this file")
        else:
            raise Exception("Can't access this file")

        if res_data["verified"] == True:
            email = res_data["email"]
            discord_id = res_data["discord_id"]
            patreon_user_id = res_data["patreon_user_id"]

            zip_file_path = download_file.pack_file.path

            temp_zip_dir = "./static/files/downloads/"
            os.makedirs(temp_zip_dir, exist_ok=True)
            temp_zip_path = os.path.join(
                temp_zip_dir, f"{download_file.name}_{patreon_user_id}.zip"
            )

            with zipfile.ZipFile(zip_file_path, "r") as original_zip:
                with zipfile.ZipFile(temp_zip_path, "w") as modified_zip:
                    for item in original_zip.infolist():
                        content = original_zip.read(item.filename)
                        if item.filename == "pack.mcmeta":
                            content += f"\n// {patreon_user_id}\n// {email}\n// {discord_id}".encode(
                                "utf-8"
                            )

                        modified_zip.writestr(item, content)

                response = FileResponse(
                    open(temp_zip_path, "rb"),
                    as_attachment=True,
                    filename=f"{download_file.pack}_{patreon_user_id}.zip",
                )

                delete_after = 1
                time.sleep(delete_after)
                os.remove(temp_zip_path)

                return response

    except Exception as e:
        print(e)
        return Response({"message": "You can't download this at this time!"})
