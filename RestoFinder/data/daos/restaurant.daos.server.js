const RestaurantModel = require("../models/Restaurant.schema.server");
const yelp = require("yelp-fusion");
var sleep = require("sleep");
const API_KEY = process.env.API_KEY;
const client = yelp.client(API_KEY);

async function populateRestaurants() {
    await RestaurantModel.remove()
    locations = ['boston', 'seatlle', 'new york']
    
    for(let location of locations){
        let count = 0
        while(count<5){
            try{
                sleep.sleep(3);
                const response = await client.search({
                    location: location,
                    limit: 50,
                    offset: count
                })
                let restaurants = response.jsonBody.businesses;
                for(let restaurant of restaurants){
                    const newRestaurant = new RestaurantModel({
                        id: restaurant.id,
                        name: restaurant.name,
                        image_url: restaurant.image_url,
                        is_closed: restaurant.is_closed,
                        location: restaurant.location,
                        phone: restaurant.phone,
                        is_claimed: false,
                        price: restaurant.price,
                        rating: restaurant.rating,
                        review_count: restaurant.review_count,
                        url: restaurant.url,
                        categories: restaurant.categories,
                    })
                    await newRestaurant.save()
                }
                count = count + 1;
            }
            catch (err){
                console.log(err);
            }
        }
        
    }
    
}

module.exports= {
    populateRestaurants
}