import Cards from "./cards";

const Catalog = () =>{
    return(
    <>
          <div id="popular-catalog">
            <Cards
              classNameCard='popular1'
              Name='popular1-name'
              childName='Пицца пепперони'
              Img1='popular1-imge'
              Price='price1APP'
              childPrice='От 400 Руб.'
              Choose='Choose-popular1'
            />
            <Cards
              classNameCard='popular2'
              Name='popular2-name'
              childName='Пицца 4 сыра'
              Img1='popular2-imge'
              Price='price2APP'
              childPrice='От 480 Руб.'
              Choose='Choose-popular2'
            />
            <Cards
              classNameCard='popular3'
              Name='popular3-name'
              childName='Пицца гавайская'
              Img1='popular3-imge'
              Price='price3'
              childPrice='От 600 Руб.'
              Choose='Choose-popular3'
            />
          </div>
        
          {/* ПИЦЦА */}
          <div id="pizza-catalog">
            <Cards
              classNameCard='pizza1'
              Name='pizza1-name'
              childName='Пицца пепперони'
              Img1='pizza1-imge'
              Price='price-pizza1'
              childPrice='От 400 Руб.'
              Choose='Choose-pizza1'
            />
            <Cards
              classNameCard='pizza2'
              Name='pizza2-name'
              childName='Пицца 4 сыра'
              Img1='pizza2-imge'
              Price='price-pizza2'
              childPrice='От 480 Руб.'
              Choose='Choose-pizza2'
            />
            <Cards
              classNameCard='pizza3'
              Name='pizza3-name'
              childName='Пицца гавайская'
              Img1='pizza3-imge'
              Price='price-pizza3'
              childPrice='От 600 Руб.'
              Choose='Choose-pizza3'
            />
          </div>
        
          {/* ЗАКУСКИ */}
          <div id="snacks-catalog">
            <Cards
              classNameCard='snacks1'
              Name='snacks1-name'
              childName='Картошка фри'
              Img1='snacks1-imge'
              Price='price-snacks1'
              childPrice='От 100 Руб.'
              Choose='Choose-snacks1'
            />
            <Cards
              classNameCard='snacks2'
              Name='snacks2-name'
              childName='Наггетсы'
              Img1='snacks2-imge'
              Price='price-snacks2'
              childPrice='От 75 Руб.'
              Choose='Choose-snacks2'
            />
            <Cards
              classNameCard='snacks3'
              Name='snacks3-name'
              childName='Луковые кольца'
              Img1='snacks3-imge'
              Price='price-snacks3'
              childPrice='От 150 Руб.'
              Choose='Choose-snacks3'
            />
          </div>
        
          {/* НАПИТКИ */}
          <div id="Drinks-catalog">
            <Cards
              classNameCard='Drinks1'
              Name='Drinks1-name'
              childName='Кола'
              Img1='Drinks1-imge'
              Price='price-Drinks1'
              childPrice='От 150 Руб.'
              Choose='Choose-Drinks1'
            />
            <Cards
              classNameCard='Drinks2'
              Name='Drinks2-name'
              childName='Фанта'
              Img1='Drinks2-imge'
              Price='price-Drinks2'
              childPrice='От 130 Руб.'
              Choose='Choose-Drinks2'
            />
            <Cards
              classNameCard='Drinks3'
              Name='Drinks3-name'
              childName='Спрайт'
              Img1='Drinks3-imge'
              Price='price-Drinks3'
              childPrice='От 180 Руб.'
              Choose='Choose-Drinks3'
            />
          </div>
        
          {/* ДЕСЕРТЫ */}
          <div id="Desserts-catalog">
            <Cards
              classNameCard='Desserts1'
              Name='Desserts1-name'
              childName='Мороженое'
              Img1='Desserts1-imge'
              Price='price-Desserts1'
              childPrice='От 300 Руб.'
              Choose='Choose-Desserts1'
            />
            <Cards
              classNameCard='Desserts2'
              Name='Desserts2-name'
              childName='Тирамису'
              Img1='Desserts2-imge'
              Price='price-Desserts2'
              childPrice='От 430 Руб.'
              Choose='Choose-Desserts2'
            />
            <Cards
              classNameCard='Desserts3'
              Name='Desserts3-name'
              childName='Чизкейк "Сникерс"'
              Img1='Desserts3-imge'
              Price='price-Desserts3'
              childPrice='От 680 Руб.'
              Choose='Choose-Desserts3'
            />
          </div>
        
          {/* СОУСЫ */}
          <div id="sauces-catalog">
            <Cards
              classNameCard='sauces1'
              Name='sauces1-name'
              childName='Соус "Сырный"'
              Img1='sauces1-imge'
              Price='price-sauces1'
              childPrice='От 80 Руб.'
              Choose='Choose-sauces1'
            />
            <Cards
              classNameCard='sauces2'
              Name='sauces2-name'
              childName='Соус "BBQ"'
              Img1='sauces2-imge'
              Price='price-sauces2'
              childPrice='От 65 Руб.'
              Choose='Choose-sauces2'
            />
            <Cards
              classNameCard='sauces3'
              Name='sauces3-name'
              childName='Соус "1000 Островов"'
              Img1='sauces3-imge'
              Price='price-sauces3'
              childPrice='От 80 Руб.'
              Choose='Choose-sauces3'
            />
          </div>
          <div id="Combo-catalog">
            <Cards
              classNameCard='Combo1'
              Name='Combo1-name'
              childName='Пеперони + Сырный'
              Combo = 'true'
              Img1='Combo1-imge1'
              Img2 = 'Combo1-imge2'
              Price='price-Combo1'
              childPrice='От 450 Руб.'
              Choose='Choose-Combo1'
            />
            <Cards
              classNameCard='Combo2'
              Name='Combo2-name'
              childName='Гавайская + BBQ'
              Combo = 'true'
              Img1='Combo2-imge1'
              Img2 = 'Combo2-imge2'
              Price='price-Combo2'
              childPrice='От 500 Руб.'
              Choose='Choose-Combo2'
            />
            <Cards
              classNameCard='Combo3'
              Name='Combo3-name'
              childName='4 сыра + 1000 Островов'
              Combo = 'true'
              Img1='Combo3-imge1'
              Img2 = 'Combo3-imge2'
              Price='price-Combo3'
              childPrice='От 600 Руб.'
              Choose='Choose-Combo3'
            />
          </div>
    </>
    )
}

export default Catalog