Module("Application.Pages.Site.Home", function() {
  var t = I18n.t;

  function Home(root) {
    this.root = root;
    this.button = root.find("button");
  }

  Home.prototype.setup = function() {
    console.log("[home]", "setting up");
    this.button.on("click", this.onButtonClick.bind(this));
  };

  Home.prototype.run = function() {
    console.log("[home]", "running code");
  };

  Home.prototype.onButtonClick = function() {
    alert(t("you_clicked_a_button"));
  };

  return Home;
});
