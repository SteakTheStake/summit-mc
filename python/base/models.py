from django.db import models

# Create your models here.


class PackFile(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    pack = models.CharField(max_length=200, null=False, blank=False)
    tier = models.CharField(max_length=200, null=False, blank=False)
    pack_file = models.FileField(null=False, blank=False)

    def __str__(self) -> str:
        return self.name
