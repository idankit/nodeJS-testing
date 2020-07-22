jest.mock('google-play-scraper');

const scraper = require("./scraper")
class HTTPCustomError extends Error {
    constructor(status = 400, ...params) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(...params)
  
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, HTTPCustomError)
      }
  
      this.name = 'HTTPCustomError'
      this.status = status
    }
  }


describe("scraper", ()=> {
     const mockRequest = (headers, query, params) => ({
        headers: headers,
        query: query,
        params: params
    });
    const mockResponse = (fSend, fStatus) => ({
        send:fSend,
        status: fStatus
    });
    describe("/app/:appId", ()=> {  
        let gplay = require('google-play-scraper')
        const gplay_res = {
            title: 'Google Translate',
            description: 'Translate between 103 languages by typing\r\n...' ,
            descriptionHTML: 'Translate between 103 languages by typing<br>...',
            summary: 'The world is closer than ever with over 100 languages',
            installs: '500,000,000+',
            minInstalls: 500000000,
            maxInstalls: 898626813,
            score: 4.482483,
            scoreText: '4.5',
            ratings: 6811669,
            reviews: 1614618,
            histogram: { '1': 370042, '2': 145558, '3': 375720, '4': 856865, '5': 5063481 },
            price: 0,
            free: true,
            currency: 'USD',
            priceText: 'Free',
            offersIAP: false,
            IAPRange: undefined,
            size: 'Varies with device',
            androidVersion: 'VARY',
            androidVersionText: 'Varies with device',
            developer: 'Google LLC',
            developerId: '5700313618786177705',
            developerEmail: 'translate-android-support@google.com',
            developerWebsite: 'http://support.google.com/translate',
            developerAddress: '1600 Amphitheatre Parkway, Mountain View 94043',
            privacyPolicy: 'http://www.google.com/policies/privacy/',
            developerInternalID: '5700313618786177705',
            genre: 'Tools',
            genreId: 'TOOLS',
            familyGenre: undefined,
            familyGenreId: undefined,
            icon: 'https://lh3.googleusercontent.com/ZrNeuKthBirZN7rrXPN1JmUbaG8ICy3kZSHt-WgSnREsJzo2txzCzjIoChlevMIQEA',
            headerImage: 'https://lh3.googleusercontent.com/e4Sfy0cOmqpike76V6N6n-tDVbtbmt6MxbnbkKBZ_7hPHZRfsCeZhMBZK8eFDoDa1Vf-',
            screenshots: [
              'https://lh3.googleusercontent.com/dar060xShkqnJjWC2j_EazWBpLo28X4IUWCYXZgS2iXes7W99LkpnrvIak6vz88xFQ',
              'https://lh3.googleusercontent.com/VnzidUTSWK_yhpNK0uqTSfpVgow5CsZOnBdN3hIpTxODdlZg1VH1K4fEiCrdUQEZCV0',
            ],
            video: undefined,
            videoImage: undefined,
            contentRating: 'Everyone',
            contentRatingDescription: undefined,
            adSupported: false,
            released: undefined,
            updated: 1576868577000,
            version: 'Varies with device',
            recentChanges: 'Improved offline translations with upgraded language downloads',
            comments: [],
            editorsChoice: true,
            appId: 'com.google.android.apps.translate',
            url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.translate&hl=en&gl=us'
          }
        jest.mock('google-play-scraper');
        gplay.app.mockReturnValue(gplay_res)                        
        
        test("if the app exists return the app",async ()=>{
            const spy = jest.fn()
            res = await scraper.findAppById(mockRequest({},{},{appId:"com.google.android.apps.translate"}), mockResponse(spy))
            expect(spy).toHaveBeenCalledWith(gplay_res);            
        })
        test("if the app does not exist return 'app not found' with status code 404",async ()=>{
            gplay.app.mockRejectedValue(new HTTPCustomError(404,'App not found'))              
            const spysend = jest.fn()
            const spystatus = jest.fn()
            res = await scraper.findAppById(mockRequest({},{},{appId:"com.google.android.apps.translate2"}), mockResponse(spysend,spystatus))
            expect(spysend).toHaveBeenCalledWith('App not found');  
            expect(spystatus).toHaveBeenCalledWith(404);  

        })
    })
    describe("/app/search/:term", ()=> {
        let gplay = require('google-play-scraper')
        test("call gplay.search with the correct params",async ()=>{
            const iron_apps =[{title: 'Iron Browser - by SRWare', appId: 'org.iron.srware', url: 'https://play.google.com/store/apps/details?id=org.iron.srware', icon: 'https://lh3.googleusercontent.com/FnAqc4oG_n6B…8GwTUC9KhDSwUrrarsi7gu5LVJPY9LV5T8fdCN46WjlWE', developer: 'SRWare'}
            ,{title: 'Iron Marines: rts offline game', appId: 'com.ironhidegames.android.ironmarines', url: 'https://play.google.com/store/apps/details?id=com.ironhidegames.android.ironmarines', icon: 'https://lh3.googleusercontent.com/APnGswTAqXSk…-EDcyovQMPTlcNbxFNZnibn6qZ4WzXGAar-4MRFRNrVJo', developer: 'Ironhide Game Studio'}
            ,{title: 'Iron Rope Hero: Vice Town', appId: 'rope.ironman.vice.town', url: 'https://play.google.com/store/apps/details?id=rope.iro'}]
            gplay.search.mockReturnValue(iron_apps)                                    
            const spy = jest.fn()
            res = await scraper.searchApps(mockRequest({},{count:2}, {term:"iron"}),mockResponse(spy))
            expect(gplay.search).toHaveBeenCalledWith({term: "iron", num:2});  
        })
        test("if count is NaN, send the response 'count must be a number' with status 400 ",async ()=>{
            const iron_apps =[{title: 'Iron Browser - by SRWare', appId: 'org.iron.srware', url: 'https://play.google.com/store/apps/details?id=org.iron.srware', icon: 'https://lh3.googleusercontent.com/FnAqc4oG_n6B…8GwTUC9KhDSwUrrarsi7gu5LVJPY9LV5T8fdCN46WjlWE', developer: 'SRWare'}
            ,{title: 'Iron Marines: rts offline game', appId: 'com.ironhidegames.android.ironmarines', url: 'https://play.google.com/store/apps/details?id=com.ironhidegames.android.ironmarines', icon: 'https://lh3.googleusercontent.com/APnGswTAqXSk…-EDcyovQMPTlcNbxFNZnibn6qZ4WzXGAar-4MRFRNrVJo', developer: 'Ironhide Game Studio'}
            ,{title: 'Iron Rope Hero: Vice Town', appId: 'rope.ironman.vice.town', url: 'https://play.google.com/store/apps/details?id=rope.iro'}]
            gplay.search.mockReturnValue(iron_apps)                                    
            const spysend = jest.fn()
            const spystatus = jest.fn()
            res = await scraper.searchApps(mockRequest({},{count:'two'}, {term:"iron"}),mockResponse(spysend, spystatus))
            expect(spysend).toHaveBeenCalledWith(new Error('count must be a number'));
            expect(spystatus).toHaveBeenCalledWith(400)
        })
        test("if count <1, send the response 'count must be a positive number' with status 400",async ()=>{
            const iron_apps =[{title: 'Iron Browser - by SRWare', appId: 'org.iron.srware', url: 'https://play.google.com/store/apps/details?id=org.iron.srware', icon: 'https://lh3.googleusercontent.com/FnAqc4oG_n6B…8GwTUC9KhDSwUrrarsi7gu5LVJPY9LV5T8fdCN46WjlWE', developer: 'SRWare'}
            ,{title: 'Iron Marines: rts offline game', appId: 'com.ironhidegames.android.ironmarines', url: 'https://play.google.com/store/apps/details?id=com.ironhidegames.android.ironmarines', icon: 'https://lh3.googleusercontent.com/APnGswTAqXSk…-EDcyovQMPTlcNbxFNZnibn6qZ4WzXGAar-4MRFRNrVJo', developer: 'Ironhide Game Studio'}
            ,{title: 'Iron Rope Hero: Vice Town', appId: 'rope.ironman.vice.town', url: 'https://play.google.com/store/apps/details?id=rope.iro'}]
            gplay.search.mockReturnValue(iron_apps)                                    
            const spysend = jest.fn()
            const spystatus = jest.fn()
            res = await scraper.searchApps(mockRequest({},{count:-3}, {term:"iron"}),mockResponse(spysend, spystatus))
            expect(spysend).toHaveBeenCalledWith(new Error('count must be a positive number'));
            expect(spystatus).toHaveBeenCalledWith(400)            
        })        
        test("if term is longer than 100 characters send the response 'term can not be longer than 100 characters' with status 400",async ()=>{
            const iron_apps =[{title: 'Iron Browser - by SRWare', appId: 'org.iron.srware', url: 'https://play.google.com/store/apps/details?id=org.iron.srware', icon: 'https://lh3.googleusercontent.com/FnAqc4oG_n6B…8GwTUC9KhDSwUrrarsi7gu5LVJPY9LV5T8fdCN46WjlWE', developer: 'SRWare'}
            ,{title: 'Iron Marines: rts offline game', appId: 'com.ironhidegames.android.ironmarines', url: 'https://play.google.com/store/apps/details?id=com.ironhidegames.android.ironmarines', icon: 'https://lh3.googleusercontent.com/APnGswTAqXSk…-EDcyovQMPTlcNbxFNZnibn6qZ4WzXGAar-4MRFRNrVJo', developer: 'Ironhide Game Studio'}
            ,{title: 'Iron Rope Hero: Vice Town', appId: 'rope.ironman.vice.town', url: 'https://play.google.com/store/apps/details?id=rope.iro'}]
            gplay.search.mockReturnValue(iron_apps)                                    
            const spysend = jest.fn()
            const spystatus = jest.fn()
            res = await scraper.searchApps(mockRequest({},{count:1}, {term: new Array(102).join("a"), count:1}), mockResponse(spysend, spystatus))
            expect(spysend).toHaveBeenCalledWith(new Error('term can not be longer than 100 characters'));
            expect(spystatus).toHaveBeenCalledWith(400)            

        })
            
    })
})