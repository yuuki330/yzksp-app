from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

# Create your views here.

@csrf_exempt
def main_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Invalid request method'}) 

def home_view(request):
    return HttpResponse("Hello World")
