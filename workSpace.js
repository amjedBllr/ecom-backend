const PC = require('./models/PCModel')
const PCT = require('./models/PCTModel.js')
const connectDb = require('./db/connect.js')
require('dotenv').config()

const miniCategoriesData = [
    { categoryName: "Sports", typeName: "Exercise & Fitness", description: "Exercise equipment, fitness gear, and accessories." },
  { categoryName: "Sports", typeName: "Outdoor Recreation", description: "Gear and equipment for outdoor recreational activities such as camping, hiking, and fishing." },
  { categoryName: "Sports", typeName: "Sports Gear", description: "Gear for various sports such as basketball, soccer, and tennis." },
  { categoryName: "Sports", typeName: "Fan Shop", description: "Merchandise for sports fans, including apparel, accessories, and memorabilia." },

  { categoryName: "Automotive", typeName: "Car Parts", description: "Parts and accessories for cars and trucks." },
  { categoryName: "Automotive", typeName: "Car Accessories", description: "Accessories for cars and trucks such as car mats, seat covers, and car care products." },
  { categoryName: "Automotive", typeName: "Motorcycles & ATVs", description: "Parts, accessories, and gear for motorcycles and ATVs." },
  { categoryName: "Automotive", typeName: "Tires & Wheels", description: "Tires and wheels for cars, trucks, and motorcycles." },

  { categoryName: "Health", typeName: "Makeup", description: "Cosmetic products including makeup for face, eyes, and lips." },
  { categoryName: "Health", typeName: "Skin Care", description: "Skin care products such as cleansers, moisturizers, and serums." },
  { categoryName: "Health", typeName: "Hair Care", description: "Hair care products including shampoo, conditioner, and styling products." },
  { categoryName: "Health", typeName: "Personal Care", description: "Personal care products such as soap, body wash, and deodorant." },

  { categoryName: "Toys & Games", typeName: "Action Figures", description: "Action figures based on characters from movies, TV shows, and video games." },
  { categoryName: "Toys & Games", typeName: "Board Games", description: "Various board games for all ages." },
  { categoryName: "Toys & Games", typeName: "Dolls & Plush", description: "Dolls and plush toys for children." },
  { categoryName: "Toys & Games", typeName: "Educational Toys", description: "Toys designed to educate and stimulate children's minds." }]

  
const Add = async ()=>{
    try {
        await connectDb(process.env.MONGO_URL)
        let pcts = PCT.create(miniCategoriesData)
        console.log('done')
    } catch (error) {
        console.log('failed')
    }
}

Add();