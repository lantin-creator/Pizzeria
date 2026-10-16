import Categories from "./categories";
import useMenu, { menuItems } from "../hooks/useMenuSticky";

const Menu = ({ onOpenCallback }) => {
  const { isMenuSticky, activeSection } = useMenu();

  return (
    <div className="spacer">
      <div
        className={`menu ${isMenuSticky ? 'menu-sticky' : ''}`}
        style={
          isMenuSticky
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                marginTop: 0,
                zIndex: 1200,
              }
            : {}
        }
      >
        {menuItems.map((item) => (
          <Categories
            key={item.id}
            href={item.isButton ? undefined : `#${item.id}`}
            className={`${item.className} ${
              !item.isButton && activeSection === item.id ? 'active' : ''
            }`}
            childrens={item.label}
            isButton={item.isButton}
            onClick={item.isButton ? onOpenCallback : undefined}
          />
        ))}

        <Categories
          needAnIcon={true}
          href="/bascet"
          classNameCard="card-basket"
          className="Basket"
          classNameText="basket"
          childrens="Корзина"
        />
      </div>
    </div>
  );
};

export default Menu;