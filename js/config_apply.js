var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = `./styles/${config_params.theme}.css`;
    link.media = 'all';
    head.appendChild(link);

document.addEventListener("DOMContentLoaded", (event) => {

    document.querySelector(".loading-icon-cont img").src=`styles/assets/icons/loading_anims/${config_params.theme}.gif`;
    document.querySelector(".background-cont img").src=config_params.wallpaper_path;
    document.querySelector(".background-cont video").src=config_params.wallpaper_path;
    document.querySelector(".background-cont video").src=config_params.wallpaper_path;

    if(config_params.use_video_wallpaper) {
        document.querySelector(".background-cont img").remove();
    }
    else {
        document.querySelector(".background-cont video").remove();
    }

    document.querySelector(".bottom-branding img").src=`styles/assets/brandings/${config_params.theme}/${config_params.os}.png`

});