from django.db import models


class category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class product(models.Model):
    product_name = models.CharField(max_length=200)
    category = models.ForeignKey(category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField()
    inch = models.PositiveIntegerField()

    def __str__(self):
        return self.product_name



