const initialAuthState = {
    playlists: [
        {
            videos: [
                {
                    "channelTitle": "toems bundy",
                    "description": "lovely morning sizzla old but good enjoy :)",
                    "id": "x-dTiOXXPv8",
                    "thumbnailURL": "https://i.ytimg.com/vi/x-dTiOXXPv8/default.jpg",
                    "title": "lovely morning - sizzla",
                },
                {
                    "channelTitle": "منوعات منوعات",
                    "description": "لا تنسو الاشتراك في قناتنا ليصلكم الجديد الكلمات : I'm in a good mood I'm walking down the street Don't need to be rude I am! With my bare feet Tomorrow...",
                    "id": "_zZieKAwRH8",
                    "thumbnailURL": "https://i.ytimg.com/vi/_zZieKAwRH8/default.jpg",
                    "title": "Lovely Morning",
                },
                {
                    "channelTitle": "SaberH1",
                    "description": "This is the original version of \"Lovely Day\" which i decided to upload because it was not on youtube already. Please do not complain of there not being a video, as it would probably be taken...",
                    "id": "sYi7uEvEEmk",
                    "thumbnailURL": "https://i.ytimg.com/vi/sYi7uEvEEmk/default.jpg",
                    "title": "Bill Withers - Lovely Day (Original Version)",
                },
                {
                    "channelTitle": "Lounge Music",
                    "description": "HAPPY Morning - Music to Wake UP ▻ PLEASE, THUMBS UP & SUBSCRIBE! ▻ https://goo.gl/EBzGGl ▻ NEW VIDEOS https://goo.gl/QcU7ry Our Music to Wake UP can be used for relaxing, calm, wake...",
                    "id": "dCbufxhSVc8",
                    "thumbnailURL": "https://i.ytimg.com/vi/dCbufxhSVc8/default.jpg",
                    "title": "HAPPY Morning - Music to Wake UP",
                },
                {
                    "channelTitle": "s sharma",
                    "description": "LOVELY MORNING.",
                    "id": "xbKDGLGkbCQ",
                    "thumbnailURL": "https://i.ytimg.com/vi/xbKDGLGkbCQ/default.jpg",
                    "title": "LOVELY MORNING",
                },
            ],
            name: 'Cheerful awakening :)',
            id: 1,
        },
        {
            videos: [
                {
                    "channelTitle": "baileykathleen2015",
                    "description": "This would for sure be my favorite song! 3.",
                    "id": "vH2spkJzF9k",
                    "thumbnailURL": "https://i.ytimg.com/vi/vH2spkJzF9k/default.jpg",
                    "title": "Kill Myself- Tim McGraw",
                },
                {
                    "channelTitle": "Daphne Elzes",
                    "description": "Trigger warning: contains clips of self harm and suicide. NOTE: for the ones who think I'm suicidal, I'm not. I just think that people should talk more about depressions and their thoughts,...",
                    "id": "td4eZILU3yg",
                    "thumbnailURL": "https://i.ytimg.com/vi/td4eZILU3yg/default.jpg",
                    "title": "I tried to kill myself | Sad multifandom",
                },
                {
                    "channelTitle": "Mitch S",
                    "description": "Tim McGraw - Kill Myself Track # 15 Album: Live Like You Were Dying (C) 2004 Curb Records.",
                    "id": "a20h93qyG0U",
                    "thumbnailURL": "https://i.ytimg.com/vi/a20h93qyG0U/default.jpg",
                    "title": "Tim McGraw -  Kill Myself",
                },
                {
                    "channelTitle": "Rezian Nightcore",
                    "description": "Nightcore - kms (Kill Myself) ▻Subscribe here for more music : https://goo.gl/C9BZVm Listen to original song :https://soundcloud.com/notmorgn/fm-kms-prod-notmorgn ➤Support notmorgn https://s...",
                    "id": "gwURz7ktc1c",
                    "thumbnailURL": "https://i.ytimg.com/vi/gwURz7ktc1c/default.jpg",
                    "title": "Nightcore - kms (Kill Myself) || Lyrics",
                },
                {
                    "channelTitle": "Liberate The People",
                    "description": "วันนึงผมผิดพลาดกับสิ่งที่ผมคาดหวังไว้มากที่สุด เมื่อผลลัพธ์มันเลวร...",
                    "id": "cTqmE5Go52c",
                    "thumbnailURL": "https://i.ytimg.com/vi/cTqmE5Go52c/default.jpg",
                    "title": "Kill Myself - Liberate P ft. Thudong (Beat Prod. VEEK)",
                },
            ],
            name: 'Hate myself on weekdays',
            id: 2,
        },
    ]
};

function playlistsReducer(state = initialAuthState, action) {
    switch (action.type) {
    case 'INIT_PLAYLISTS':
        return { ...state, playlists: action.payload };
    case 'ADD_PLAYLIST': {
        const newPlaylist = { ...action.payload, videos: [] };
        return { ...state, playlists: state.playlists.concat(newPlaylist) };
    }
    case 'DELETE_PLAYLIST': {
        const deleteId = action.payload.id;
        return { ...state, playlists: state.playlists.filter(playlists => playlists.id !== deleteId) };
    }
    case 'ADD_VIDEO_IN_PLAYLIST': {
        const { videoInfo, playlistId } = action.payload;
        const playlistIndex = state.playlists.findIndex(playlist => playlist.id === playlistId);

        if (playlistIndex < 0) {
            return state;
        }

        const playlist = state.playlists[playlistIndex];
        const updatedPlaylist = { ...playlist, videos: playlist.videos.concat(videoInfo) };
        const playlists = Object.assign([], state.playlists, { [playlistIndex]: updatedPlaylist });

        return { ...state, playlists };
    }
    case 'REMOVE_VIDEO_FROM_PLAYLIST': {
        const { videoInfo, playlistId } = action.payload;
        return state;
    }
    default:
        return state;
    }
}

export default playlistsReducer;
