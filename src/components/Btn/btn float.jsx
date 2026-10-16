const BtnFloat = (props) => {
const {
    href = '',
    className = '',
    children,
    visible,
} = props
    return(
        <a href={href}>
          <button className={className} style={{ display: visible ? 'block' : 'none' }}>{children}</button>
        </a>
    )
}
export default BtnFloat