from pymongo import MongoClient

MONGO_URL = "mongodb+srv://fityro_user:tPr6osZ0ZG3BdPMH@cluster0.7zsbalr.mongodb.net/?appName=Cluster0"  # paste your atlas URL here

client = MongoClient(MONGO_URL)
db = client["fityro_db"]

products = [
    {
        "name": "Black Oversized T-Shirt",
        "category": "top",
        "brand": "H&M",
        "price": 999,
        "sizes": ["S", "M", "L", "XL"],
        "image_url": "https://image.hm.com/assets/hm/a6/34/a634c7702c1ed9faa1c41f03799f2496f4d319fc.jpg?imwidth=1260",
        "description": "Comfortable oversized cotton tee",
    },
    {
        "name": "Denim Blue Shirt",
        "category": "top",
        "brand": "H&M",
        "price": 1499,
        "sizes": ["M", "L", "XL"],
        "image_url": "https://image.hm.com/assets/hm/4e/06/4e0672c04f74d6aa1255f5dbd840e9da8a5aef85.jpg?imwidth=1260",
        "description": "Classic denim shirt with a relaxed fit, perfect for casual outings."
    },
    {
        "name": "Grey Hoodie",
        "category": "outerwear",
        "brand": "H&M",
        "price": 1999,
        "sizes": ["S", "M", "L"],
        "image_url": "https://image.hm.com/assets/hm/26/b1/26b15f5987e524c1c3f3d85d11700b63dcd7f0dc.jpg?imwidth=1260",
        "description": "Soft and cozy hoodie designed for everyday comfort and layering."
    },
    {
        "name": "Slim Fit Jeans",
        "category": "bottom",
        "brand": "H&M",
        "price": 2499,
        "sizes": ["30", "32", "34"],
        "image_url": "https://image.hm.com/assets/hm/39/a3/39a398899455d9e4d87c9417d3e96fb62d89b623.jpg?imwidth=1260",
        "description": "Slim-fit jeans with a modern cut, ideal for both casual and semi-formal wear."
    },
    {
        "name": "Floral Summer Dress",
        "category": "dress",
        "brand": "H&M",
        "price": 1799,
        "sizes": ["S", "M", "L"],
        "image_url": "https://image.hm.com/assets/hm/1e/e7/1ee74c7773666fabfb556078d7fd451caddeb189.jpg?imwidth=1260",
        "description": "Lightweight floral dress perfect for summer days and casual outings."
    },
    {
        "name": "White Shirt",
        "category": "top",
        "brand": "H&M",
        "price": 1299,
        "sizes": ["M", "L"],
        "image_url": "https://image.hm.com/assets/hm/ad/bd/adbd4c974580720407ca63abe28b0b691b8f43fd.jpg?imwidth=1260",
        "description": "Elegant white shirt suitable for office wear and formal occasions."
    },
    {
        "name": "Brown Jacket",
        "category": "outerwear",
        "brand": "H&M",
        "price": 2999,
        "sizes": ["S", "M", "L"],
        "image_url": "https://image.hm.com/assets/hm/44/16/4416a96142943ad08899ba6d677c2a861f7c6e5c.jpg?imwidth=1260",
        "description": "Stylish brown jacket that adds warmth and sophistication to your outfit."
    },
    {
        "name": "Beige Crop Top",
        "category": "top",
        "brand": "H&M",
        "price": 899,
        "sizes": ["S", "M", "L"],
        "image_url": "https://image.hm.com/assets/hm/88/3c/883c6f0c2d5fce27edecedefee6c429e4dfa1cb2.jpg?imwidth=1260",
        "description": "Trendy beige crop top with a minimal design for a chic look."
    },
    {
        "name": "Blue T shirt",
        "category": "top",
        "brand": "H&M",
        "price": 799,
        "sizes": ["S", "M", "L"],
        "image_url": "https://image.hm.com/assets/hm/ea/3c/ea3c5197852d11898a13f22238f9cb2311738684.jpg?imwidth=1260",
        "description": "Comfortable everyday blue t-shirt made from breathable cotton fabric."
    },
     {
        "name": "Denim Jacket",
        "category": "outerwear",
        "brand": "H&M",
        "price": 3499,
        "sizes": ["M", "L"],
        "image_url": "https://image.hm.com/assets/hm/c6/0b/c60b946013a8d50a09ab10ff8ede001b9923d883.jpg?imwidth=1260",
        "description": "Classic denim jacket that never goes out of style, perfect for layering."
    },
    {
        "name": "Red top",
        "category": "top",
        "brand": "H&M",
        "price": 999,
        "sizes": ["S", "M", "XL"],
        "image_url": "https://image.hm.com/assets/hm/10/e1/10e14e6bddaf4d24915367d6ba8acf7cf351f25d.jpg?imwidth=2160",
        "description": "Bold red top designed to make a statement with any outfit."
    },
    {
        "name": "Halter Neck Top",
        "category": "top",
        "brand": "H&M",
        "price": 1099,
        "sizes": ["M", "L"],
        "image_url": "https://image.hm.com/assets/hm/b7/ff/b7ffe7cc2d50a3908b7d63cba2492a911628a7c0.jpg?imwidth=768",
        "description": "Elegant halter neck top perfect for parties and evening outings."
    },
    {
        "name": "Yellow Cardigan",
        "category": "top",
        "brand": "H&M",
        "price": 1599,
        "sizes": ["S", "M", "L"],
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ39Oem5DjywhVux296TgFvaGjFDQCxD8KX9w&s",
        "description": "Warm yellow cardigan adding a pop of color to your wardrobe."
    },
    {
        "name": "Shorts",
        "category": "bottom",
        "brand": "H&M",
        "price": 899,
        "sizes": ["30", "32", "34"],
        "image_url": "https://image.hm.com/assets/hm/da/24/da24d1c2eec0f1320922a1f9d6bb302dc15b08a5.jpg",
        "description": "Casual shorts designed for comfort during warm weather."
    },
    {
        "name": "Pyjamas",
        "category": "bottom",
        "brand": "H&M",
        "price": 1199,
        "sizes": ["30", "32", "34", "38", "40"],
        "image_url": "https://image.hm.com/assets/hm/f1/a5/f1a5091f3a2f41739cf53f2f91e3b3000aa172ee.jpg?imwidth=1260",
        "description": "Relaxed fit pyjamas for ultimate comfort at home."
    },
    {
        "name": "Velvet Dress",
        "category": "dress",
        "brand": "H&M",
        "price": 2699,
        "sizes": ["S", "M", "L"],
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHxyT4iISH3gkJN2yvdfQpRw6NEspL6IleDA&s",
        "description": "Luxurious velvet dress ideal for evening events and special occasions."
    }

]
db.products.delete_many({})
db.products.insert_many(products)

print("✅ Products inserted successfully!")
