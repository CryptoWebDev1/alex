/*!
Ethereum address for Crypto.com, shiba, polygon ,enj and Wolverinu and Ethereum holding

0x9Ada55ea13B9bd4453a07e59Bcf054Ac9907c7ad
**/

//const https = require('https');

document.getElementById("table-1-1").innerHTML = cointable("eth");    
document.getElementById("table-1-2").innerHTML = cointable("ftm");    
document.getElementById("table-1-3").innerHTML = cointable("cro");    
document.getElementById("table-1-4").innerHTML = cointable("mana");
document.getElementById("table-1-5").innerHTML = cointable("sol");    
document.getElementById("table-1-6").innerHTML = cointable("scan");
//document.getElementsByClassName("btc timestamp")[0].innerHTML = "$3.50";

//hardcoded values
var ftm_coded = {supply : 2545006273, balance : 2235.2162,
                 position_eth : "TBD"}
var eth_coded = {supply : 118753258.44, balance : 6.5455,
                 position_eth : 5.608957907598547763}
var cro_coded = {supply : 100000000000 , balance : 20859.87353941,
                 position_eth : "TBD"} 
var mana_coded = {supply : 2193832427 , balance : 4778.2152,
    position_eth : "TBD"}
var sol_coded = {supply : 319660147.78, balance : 99.6379,
    position_eth : "TBD"}
var scan_coded = {supply : 1000000000, balance : 613966.5938,
    position_eth : "TBD"}                                 

//generic table function
function cointable(ticker){
    return `<table class="table table-bordered"><tbody>
        <tr><td class="table-head">Token Value (USD)</td><td class="table-des ${ticker} price"> RIP</td></tr>
        <tr><td class="table-head">Total Token Supply</td><td class="table-des ${ticker} supply"> RIP</td></tr>
        <tr><td class="table-head">Market Cap</td><td class="table-des ${ticker} market-cap"> RIP</td></tr>
        <tr><td class="table-head">Tokens in Moonbag</td><td class="table-des ${ticker} balance">RIP</td></tr>
        <tr><td class="table-head">Moonbag Token Value (USD)</td><td class="table-des ${ticker} position-usd">RIP</td></tr>
        <tr><td class="table-head">Moonbag Token Value (ETH)</td><td class="table-des ${ticker} position-eth">RIP</td></tr>
        <tr><td class="table-head">% of Total Supply</td><td class="table-des ${ticker} share">RIP</td></tr>
        <tr><td class="table-head">Update Timestamp</td><td class="table-des ${ticker} timestamp">RIP</td></tr>
    </tbody></table>`;
}
//generic API call assignment
function coingecko(ticker, stats){    
document.getElementsByClassName(`${ticker} price`)[0].innerHTML = `${stats.usd}`;
document.getElementsByClassName(`${ticker} market-cap`)[0].innerHTML = `${stats.usd_market_cap}`;
}
var form_usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 3, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumSignificantDigits: 6, // (causes 2500.99 to be printed as $2,501)
  });


function coinwriter(ticker, stats, hardcode){
    var position_usd = hardcode.balance*stats.usd;
    var position_eth = position_usd/eth_usd;
    var share = hardcode.balance/hardcode.supply;
    //console.log( position_eth);
    document.getElementsByClassName(`${ticker} price`)[0].innerHTML = form_usd.format(`${stats.usd}`);
    document.getElementsByClassName(`${ticker} supply`)[0].innerHTML = `${hardcode.supply}`;
    document.getElementsByClassName(`${ticker} market-cap`)[0].innerHTML = "$"+parseFloat(`${stats.usd_market_cap}`).toFixed(2);
    document.getElementsByClassName(`${ticker} balance`)[0].innerHTML = parseFloat(`${hardcode.balance}`).toFixed(5);
    document.getElementsByClassName(`${ticker} position-usd`)[0].innerHTML = "$"+parseFloat(position_usd).toFixed(2);
    document.getElementsByClassName(`${ticker} position-eth`)[0].innerHTML = parseFloat(position_eth).toFixed(5);
    document.getElementsByClassName(`${ticker} share`)[0].innerHTML = parseFloat(share*100).toPrecision(4).split('e-')[0]+" %";//.toFixed(2)+"%";
    document.getElementsByClassName(`${ticker} timestamp`)[0].innerHTML = Date(Math.floor(`${stats.last_updated_at}` * 1000)).toLocaleString();   
    
}

function pastprice(id){
    url = "https://api.coingecko.com/api/v3/coins/"+`${id}`+"/market_chart?vs_currency=usd&days=1&interval=hourly";
    fetch(url,{
	    method: 'GET'}).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (data){
        console.log("Uhoh", data);
        return data.prices[0][1];
        //console.log("Success",oldprice);
        
        }).catch(function (err) {
            // Error handling
            console.warn('Coingecko history API call failed:', err);
        });
}

var oldprice = pastprice("ethereum");
console.log("Function calls:", oldprice);

var coins;
var portfolio_usd = 0;
var eth_usd = 0;
fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain%2Cfantom%2Cethereum%2Cdecentraland%2Csolana%2Ccoinscan&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true',{
	method: 'GET'}).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (data) {
        // Further processing
        coins = data;
        //console.log("Main API response:", coins);
        eth_usd = coins.ethereum.usd;
        coinwriter("eth", coins.ethereum, eth_coded)
        coinwriter("ftm", coins.fantom, ftm_coded)
        coinwriter("cro", coins["crypto-com-chain"], cro_coded)
        coinwriter("mana", coins.decentraland, mana_coded)
        coinwriter("sol", coins.solana, sol_coded)
        coinwriter("scan", coins.coinscan, scan_coded)
        //coingecko("btc", coins.ethereum)
        x = document.getElementsByClassName("position-usd");
        l = x.length;
        console.log("what are USD positions:", x)
        for (i = 0; i < l; i++) {portfolio_usd += parseFloat(x[i].innerHTML.replace('$', ''));}
        portfolio_eth = portfolio_usd / eth_usd;
        document.getElementById("bag-value-USD").innerHTML = "$"+ (Math.round((portfolio_usd + Number.EPSILON) * 100) / 100).toString()+" USD";
        document.getElementById("bag-value-ETH").innerHTML = (Math.round((portfolio_eth + Number.EPSILON) * 1000) / 1000).toString()+" ETH";
        //console.log(data);

        fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=hourly',{
	    method: 'GET'}).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
        }).then(function (data) {
            //console.log("Historical:",data);
            console.log(data.prices[0][1]);

        }).catch(function (err) {
            // Error handling
            console.warn('Coingecko history API call failed:', err);
        });



    }).catch(function (err) {
        // Error handling
        console.warn('Coingecko main API call failed:', err);
    });



