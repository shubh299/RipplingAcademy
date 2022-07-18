from django.test import TestCase, Client


class AdminTestCase(TestCase):
    def test_add_restaurant_manager(self):
        client = Client()
        response = client.get("/admin/add-restaurant-manager?auth-token=abc123")
        print(response)
        self.assertEqual(response.status_code, 200)
