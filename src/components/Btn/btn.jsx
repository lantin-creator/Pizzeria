const Btn = (props) => {
const {
    href = '',
    className = '',
    children,
} = props
    return(
        <a href={href}>
          <button className={className}>{children}</button>
        </a>
    )
}
export default Btn