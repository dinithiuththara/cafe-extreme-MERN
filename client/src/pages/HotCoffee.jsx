import CategoryMenuPage from "./CategoryMenuPage.jsx";

const HotCoffee = () => (
  <CategoryMenuPage
    categorySlug="hot-coffee"
    title="Hot Coffee"
    tagline="Rich, bold espresso-based classics — brewed hot, served with intent."
    otherCategory={{ label: "Iced Coffee", to: "/menu/iced-coffee" }}
  />
);

export default HotCoffee;
