import CategoryMenuPage from "./CategoryMenuPage.jsx";

const IcedCoffee = () => (
  <CategoryMenuPage
    videoSrc="/videos/iced-coffee-brew.mp4"
    categorySlug="iced-coffee"
    title="Iced Coffee"
    tagline="Chilled espresso-based coffee, crafted for warm days."
    otherCategory={{ label: "Hot Coffee", to: "/menu/hot-coffee" }}
  />
);

export default IcedCoffee;
