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
            name = req.POST.get("name")
            pack = req.POST.get("pack")
            uploaded_file = req.FILES.get("pack_file")
            key = req.POST.get("key")
            print(key, env("KEY"))

            pack_file = PackFile(name=name, pack=pack, pack_file=uploaded_file)
            pack_file.save()

            return JsonResponse({"message": "File uploaded successfully."})
        except:
            return JsonResponse({"message": "Failed to upload."})

    return JsonResponse({"message": "Hello ;)!"})
