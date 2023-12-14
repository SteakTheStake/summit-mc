from django.urls import path
from .views import upload_pack, get_download

urlpatterns = [
    path("upload-file/", upload_pack, name="upload-file"),
    path("get-download/<str:pk>/", get_download, name="get-download"),
]
