/**
 * HTML template for the iframe element.
 */
export const iframeHtml = /*html*/ `
  <html>
   <head></head>
   <body>
     <div id="root"></div>
     <script>
       window.addEventListener('message', async event => {
         try {
           await eval(event.data);
         } catch (error) {
           const root = document.querySelector('#root');
           root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
           console.log(error);
         }
       }, false);
     </script>
   </body>
  </html>
 `;
