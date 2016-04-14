// import axios from 'axios';

const ARTIST_ID = `0SfsnGyD8FpIN4U4WCkBZ5`;

function getAlbums({numOfItems, artistId=ARTIST_ID, page=1}) {
    var offset = (page - 1) * numOfItems;
    return fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?offset=${offset}&limit=${numOfItems}&album_type=single,album,compilation,appears_on,ep`)
        .then(function (res) {
            return res.json();
        });
}

var state = {
    albums: []
};

function resolver(action) {
    switch (action.type) {
        case 'LOAD_INFO':
            getAlbums({numOfItems: 10, page: action.page})
                .then(function (data) {
                    state = Object.assign({}, {albums: [...data.items, ...state.albums]});
                    postMessage(JSON.stringify(state));
                });
        default:
            return;
    }

}

global.onmessage = function (jsonData) {
    var data = JSON.parse(jsonData.data);
    resolver(data);
};

