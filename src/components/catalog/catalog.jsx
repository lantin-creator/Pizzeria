
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "./cards";
import { apiRequest } from "../../api";

const imageModules = import.meta.glob("../../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const imagesByName = new Map(
  Object.entries(imageModules).map(([path, url]) => [
    decodeURIComponent(path.split("/").pop()),
    url,
  ])
);

const sections = [
  {
    key: "pizza",
    id: "pizza-catalog",
    css: "pizza",
    category: "pizza",
  },
  {
    key: "snacks",
    id: "snacks-catalog",
    css: "snacks",
    category: "snacks",
  },
  {
    key: "Drinks",
    id: "Drinks-catalog",
    css: "Drinks",
    category: "Drinks",
  },
  {
    key: "Desserts",
    id: "Desserts-catalog",
    css: "Desserts",
    category: "Desserts",
  },
  {
    key: "sauces",
    id: "sauces-catalog",
    css: "sauces",
    category: "sauces",
  },
  {
    key: "Combo",
    id: "Combo-catalog",
    css: "Combo",
    category: "Combo",
  },
];

function normalizeCategory(category) {
  const value = String(category).toLowerCase();

  const categories = {
    pizza: "pizza",

    snack: "snacks",
    snacks: "snacks",

    drink: "Drinks",
    drinks: "Drinks",

    dessert: "Desserts",
    desserts: "Desserts",

    sauce: "sauces",
    sauces: "sauces",

    combo: "Combo",
  };

  return categories[value] || category;
}

function getImages(product) {
  if (!product.image) return [];

  return product.image
    .split(",")
    .map((name) => name.trim())
    .map((name) => imagesByName.get(name));
}

const Catalog = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const result = await apiRequest("/products");

        if (!cancelled) {
          setProducts(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить каталог. Попробуйте позже.");
          console.error("Catalog error:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleChoose(product) {
    const variant = product.variants?.[0];

    if (!variant) {
      setMessage("У этого товара пока нет доступных вариантов.");
      return;
    }

    setAddingId(variant.id);
    setMessage("");

    try {
      await apiRequest("/cart/items", {
        method: "POST",
        body: {
          variantId: variant.id,
          quantity: 1,
        },
      });

      setMessage(`${product.name} добавлена в корзину!`);
    } catch (err) {
      if (err.status === 401) {
        setMessage("Для добавления товара необходимо войти в аккаунт.");
      } else {
        setMessage("Не удалось добавить товар. Попробуйте ещё раз.");
      }

      console.error("Add to cart error:", err);
    } finally {
      setAddingId(null);
    }
  }

  function renderCard(
    product,
    prefix,
    index,
    popular = false,
    isCombo = false
  ) {
    const number = index + 1;
    const variant = product.variants?.[0];
    const images = getImages(product);

    const cardClass = `${prefix}${number}`;

    const priceClass = popular
      ? ["price1APP", "price2APP", "price3"][index]
      : `price-${cardClass}`;

    const price = variant
      ? `От ${variant.price.toLocaleString("ru-RU")} Руб.`
      : "Нет в наличии";

    return (
      <Cards
        key={product.id}
        classNameCard={cardClass}
        Name={`${cardClass}-name`}
        childName={product.name}
        Img1={`${cardClass}-imge${isCombo ? "1" : ""}`}
        Img2={
          images.length > 1
            ? `${cardClass}-imge2`
            : ""
        }
        image1={images[0]}
        image2={images[1]}
        Price={priceClass}
        childPrice={price}
        Choose={`Choose-${cardClass}`}
        onChoose={() => handleChoose(product)}
        disabled={!variant || addingId === variant.id}
        buttonText={
          addingId === variant?.id ? "Добавляем..." : "Выбрать"
        }
      />
    );
  }

  if (loading) {
    return <p style={{ color: "white" }}>Загружаем каталог...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  const popularProducts = products.filter(
    (product) => product.isPopular
  );

  return (
    <>
      {message && (
        <p
          style={{
            color: "white",
            textAlign: "center",
            padding: "15px",
          }}
        >
          {message}

          {message.includes("войти") && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => navigate("/logo")}
              >
                Войти
              </button>
            </>
          )}
        </p>
      )}

      <div id="popular-catalog">
        {popularProducts.slice(0, 3).map((product, index) =>
          renderCard(product, "popular", index, true)
        )}
      </div>

      {sections.map((section) => {
        const categoryProducts = products.filter(
          (product) =>
            normalizeCategory(product.category) === section.category
        );

        return (
          <div id={section.id} key={section.key}>
            {categoryProducts.slice(0, 3).map((product, index) =>
              renderCard(
                product,
                section.css,
                index,
                false,
                section.key === "Combo"
              )
            )}
          </div>
        );
      })}
    </>
  );
};

export default Catalog;
