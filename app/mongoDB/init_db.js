db = db.getSiblingDB('db_recipts');

db.receipt.insertMany([
  {
    "id": 1,
    "register_date": "2025-04-04",
    "total": 380,
    "image_url": "https://profile.line-scdn.net/0hAEbGR2bHHmpfPjer_3NhPWN7EAcoEBgiJw8ECC9sRQ5wCQ45ZwtZCC5rE1MiDQk7M11WXHlpQAh2",
    "created_by": "U0f136ca320c760a273a3d1e21d5365a2",
    "is_updated": false,
  },
  {
    "id": 2,
    "register_date": "2025-04-05",
    "total": 1020,
    "image_url": "https://profile.line-scdn.net/0hAEbGR2bHHmpfPjer_3NhPWN7EAcoEBgiJw8ECC9sRQ5wCQ45ZwtZCC5rE1MiDQk7M11WXHlpQAh2",
    "created_by": "Ud8997d0d12b1e625a2bf1bafdfc6d5e0",
    "is_updated": true,
    "item": [
      {
        "name": "パン",
        "price": 120,
        "quantity": 2,
        "reduced_tax": true
      },
      {
        "name": "卵",
        "price": 200,
        "quantity": 1,
        "reduced_tax": true
      },
      {
        "name": "バナナ",
        "price": 290,
        "quantity": 2,
        "reduced_tax": true
      }
    ]
  },
  {
    "id": 3,
    "register_date": "2025-04-06",
    "total": 760,
    "image_url": "https://profile.line-scdn.net/0hAEbGR2bHHmpfPjer_3NhPWN7EAcoEBgiJw8ECC9sRQ5wCQ45ZwtZCC5rE1MiDQk7M11WXHlpQAh2",
    "created_by": "U0f136ca320c760a273a3d1e21d5365a2",
    "is_updated": false,
    "item": [
      {
        "name": "コーヒー",
        "price": 380,
        "quantity": 2,
        "reduced_tax": false
      }
    ]
  },
  {
    "id": 4,
    "register_date": "2025-04-06",
    "total": 1460,
    "image_url": "https://profile.line-scdn.net/0hAEbGR2bHHmpfPjer_3NhPWN7EAcoEBgiJw8ECC9sRQ5wCQ45ZwtZCC5rE1MiDQk7M11WXHlpQAh2",
    "created_by": "Ud8997d0d12b1e625a2bf1bafdfc6d5e0",
    "is_updated": true,
    "item": [
      {
        "name": "お米",
        "price": 1460,
        "quantity": 1,
        "reduced_tax": true
      }
    ]
  },
  {
    "id": 5,
    "register_date": "2025-04-06",
    "total": 830,
    "image_url": "https://profile.line-scdn.net/0hAEbGR2bHHmpfPjer_3NhPWN7EAcoEBgiJw8ECC9sRQ5wCQ45ZwtZCC5rE1MiDQk7M11WXHlpQAh2",
    "created_by": "U0f136ca320c760a273a3d1e21d5365a2",
    "is_updated": false,
    "item": [
      {
        "name": "チョコレート",
        "price": 130,
        "quantity": 3,
        "reduced_tax": false
      },
      {
        "name": "ジュース",
        "price": 220,
        "quantity": 1,
        "reduced_tax": false
      },
      {
        "name": "ポテトチップス",
        "price": 170,
        "quantity": 1,
        "reduced_tax": false
      }
    ]
  }
]
);
