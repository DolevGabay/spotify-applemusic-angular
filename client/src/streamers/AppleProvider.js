import axios from 'axios';

class AppleProvider {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.header = { Authorization: 'Bearer ' + accessToken };
        this.name = '';
        this.playlists = [];
    }

    async loadName() {

    };

    async loadPlaylists() {

    }

    async loadData() {
        await this.configure(this.accessToken);
        await this.LogIn();
        this.header = {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Music-User-Token': this.getMusicInstance().musicUserToken,
        };

        
    }

    async configure() {
       this.instance.configure({
            developerToken: token,
            app: {
                name: 'MDsolutions',
                build: '1978.4.1'
            }
        });
    }

    getMusicInstance() {
        return instance.getInstance();
    }

    isLoggedIn() {
        try {
            return getMusicInstance().isAuthorized
        }
        catch (error) {
            return false;
        }
    }

    LogIn() {
        return getMusicInstance().authorize()
    }
}

export default AppleProvider;