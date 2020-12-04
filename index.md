<!DOCTYPE html>
<html class="has-navbar-fixed-top has-searchbar-fixed-top" lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="theme-color" content="#0f171e">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ciao!</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/dpad-controller.js" async defer></script>
    <script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/debug-controller.js" async defer></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="assets/custom.css">
  </head>
  <body>
      <!-- Navigation bar starts here -->
    <nav class="navbar is-dark is-fixed-top">
        <div class="navbar-brand">
            <a href="" class="navbar-item">
                <img src="assets/logo.png" alt="">
            </a>
            <a class="navbar-burger">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <a href="?page=movies" class="navbar-item has-text-white">Movies</a>
            </div>
        </div>
        <div class="navbar-item" id="searchForm">
            <form action="" class="form">
                <div class="field has-addons">
                    <div class="control is-expanded">
                        <input type="text" name="search" class="input is-fullwidth is-small" placeholder="Search here...">
                    </div>
                    <div class="control">
                        <button class="button is-dark is-small" type="submit">Search</button>
                    </div>
                </div>
            </form>
        </div>
    </nav>
        <!-- navigration bar ends here -->

        <!-- main section starts here -->
    <div class="mainSection">
    </div>
        <!-- main section ends here -->



        <!-- footer stars here -->
    <p class="has-text-centered container is-fluid">
        <img src="assets/logo.png" alt="" width="150"><br>
        <ul class="footerLinks has-text-centered">
            <li><a class="footerLink" href="">Terms and Privacy Notice </a></li>
            <li><a class="footerLink" href="">Send us feedback </a></li>
            <li><a class="footerLink" href="">Help</a></li>
        </ul>
        <p class="lastText has-text-centered">Whiterose by fSociety and its fans :)</p>
    </p>
        <!-- footer ends here -->
        <script src="main.js"></script>
        <script src="token.js"></script>
        <script src="hoichoi.js"></script>
        <script src="details.js"></script>
  </body>
</html>
