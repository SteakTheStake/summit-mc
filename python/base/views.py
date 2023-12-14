from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt

from .models import PackFile

# Create your views here.


@csrf_exempt
def upload_pack(req):
    if req.POST:
        try:
            name = req.POST.get("name")
            pack = req.POST.get("pack")
            tier = req.POST.get("patreon_id")
            uploaded_file = req.FILES.get("file")

            pack_file = PackFile(
                name=name, pack=pack, tier=tier, pack_file=uploaded_file
            )
            pack_file.save()

            return JsonResponse({"message": "File uploaded successfully."})
        except:
            return JsonResponse({"message": "Failed to upload."})

    return JsonResponse({"message": "Hello ;)!"})
