var firebaseStorage = firebase.storage()

$(document).ready(() => {

    // solution from https://jennamolby.com/how-to-display-dynamic-content-on-a-page-using-url-parameters/
    // Parse the URL parameter
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    // Give the parameter a variable name
    let dynamicContent = getParameterByName('id');
    console.log(dynamicContent)

    loadItem(dynamicContent)
})

function loadItem(groupName) {
    $.ajax({
        url: '/load_item_info',
        type: 'Get',
        datatype: 'json',
        data: groupName,
        statusCode: {
            404: function () {
                //this happens when express gives the 404 error code
                window.location.pathname = '/404.html'
            }
        },
        success: (data) => {
            updatePage(data)
        }
    })
}

//creates an appropriate aisle element from the given aisle element
function updatePage(data) {
    console.log(data)

    document.getElementById('item-name').innerHTML = ( data['name'])
    document.getElementById('item-wt').innerHTML += ( data['weight'] + ' lbs')
    document.getElementById('item-price').innerHTML += ( " "+ data['price'])

    document.getElementById('item-details').innerHTML = ('Aisle: ' + data['aisle'] + '<br>')
    document.getElementById('item-details').innerHTML += ('Group: ' + data['group'] + '<br>')

    let image = document.getElementById('item-img1')
    let image2 = document.getElementById('item-img2')

    let imgRef = firebaseStorage.refFromURL(data['imgURL']);
    imgRef.getDownloadURL().then(function (url) {
        image.src = url
        image2.src = url
    }).catch(function (error) {
        console.log(error)
    });
}