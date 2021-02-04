<?php

class Render {
  function __construct($view = '', $view_data = []) {
    $loader = new \Twig\Loader\FilesystemLoader('src/templates');
    $twig = new \Twig\Environment($loader);


    echo $twig->render('includes/header.twig', $view_data);
    echo $twig->render($view . '.twig', $view_data);
    echo $twig->render('includes/footer.twig', $view_data);
  }
}