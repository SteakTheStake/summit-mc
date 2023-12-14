from django.urls import path
from .views import upload_pack

urlpatterns = [
    path("upload-file/", upload_pack, name="upload-file"),
]
