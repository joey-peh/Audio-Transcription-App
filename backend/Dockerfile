
FROM python:3.9-slim-buster
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

#Specify the port number
EXPOSE 5000

# Run the application
# ENTRYPOINT ["python"]
# CMD ["app.py"]

# Using Gunicorn for deployment
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
