from django.db import models
from django.contrib.auth.models import User
from products.models import product


class Cart(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.product.product_name}"