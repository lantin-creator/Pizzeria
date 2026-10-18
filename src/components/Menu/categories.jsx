import { HashLink as Link } from 'react-router-hash-link';

const Categories = (props) => {
  const {
    to = '',
    className = '',
    childrens,
    needAnIcon,
    classNameText = '',
    classNameCard,
    isButton = false,
    onClick,
  } = props;

  if (needAnIcon) {
    return (
      <Link to={to}>
        <div className={classNameCard}>
          <div className={className}></div>
          <div className={classNameText}>{childrens}</div>
        </div>
      </Link>
    );
  }

  if (isButton) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {childrens}
      </button>
    );
  }

  return (
    <Link to={to}>
      <div className={className}>{childrens}</div>
    </Link>
  );
};

export default Categories;