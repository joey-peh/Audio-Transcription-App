from app import app
import pytest
from models import db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        if not app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite:///:memory:"):
            pytest.fail("CRITICAL: Tests are using wrong DB! Aborting.")
        db.create_all()
        with app.test_client() as test_client:
            yield test_client
        db.drop_all()
