from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt

from .models import PackFile


from pathlib import Path
import environ
import os

BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
env = environ.Env()


@csrf_exempt
def upload_pack(req):
    if req.POST:
        try:
            key = req.POST.get("key")
            if key == env("KEY"):
                id = req.POST.get("id")
                name = req.POST.get("name")
                pack = req.POST.get("pack")
                uploaded_file = req.FILES.get("pack_file")

                pack_file = PackFile(
                    id=id, name=name, pack=pack, pack_file=uploaded_file
                )
                pack_file.save()

                return JsonResponse({"message": "File uploaded successfully."})
            raise Exception("Unauth")
        except:
            return JsonResponse({"message": "Failed to upload."})

    return JsonResponse({"message": "Hello ;)!"})
