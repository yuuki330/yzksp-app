from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def main_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Invalid request method'}) 
