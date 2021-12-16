import { NavLink, Outlet, useSearchParams, useLocation } from 'react-router-dom';
import { getInvoices } from '../../data';

function QueryNavLink(props) {
  let location = useLocation();
  // return <NavLink {...{...props, to: `${props.to}${location.search}`}}>{ props.name }</NavLink>;
  return <NavLink {...props} to={`${props.to}${location.search}`}>{ props.name }</NavLink>;
}
export default function Test1() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
      <input
        value={searchParams.get("filter") || ""}
        onChange={event => {
          let filter = event.target.value;
          if (filter) {
            setSearchParams({ filter });
          } else {
            setSearchParams({});
          }
        }}
      />
      {invoices
        .filter(invoice => {
          let filter = searchParams.get("filter");
          if (!filter) return true;
          let name = invoice.name.toLowerCase();
          return name.startsWith(filter.toLowerCase());
        }).map(invoice => (
          <QueryNavLink
            style={({ isActive }) => {
              return {
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : ""
              };
            }}
            to={`/test1/${invoice.number}`}
            key={invoice.number}
            name={invoice.name}
           />
        ))}
      </nav>
      <Outlet />
    </div>
  ); 

}