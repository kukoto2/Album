angular.module('album').directive("imageResize", [
  "$parse", function ($parse) {
      return {
          link: function (scope, elm, attrs) {
              var imageHeight = imageHeight = $parse(attrs.imageHeight)(scope);
              elm.bind("load", function (e) {
                  elm.unbind("load");
                  var canvas, ctx, neededHeight, neededWidth;
                  neededHeight = imageHeight;
                  neededWidth = (elm[0].naturalWidth * imageHeight) / elm[0].naturalHeight;
                  canvas = document.createElement("canvas");
                  canvas.width = neededWidth;
                  canvas.height = neededHeight;
                  ctx = canvas.getContext("2d");
                  ctx.drawImage(elm[0], 0, 0, neededWidth, neededHeight);
                  elm.attr('src', canvas.toDataURL("image/jpeg"));
              });
          }
      };
  }
]);