function displayWei(id, wei, ethToUsd) {
    ether = web3.fromWei(wei, "ether");
    $(id).text(ether.toFormat(3, web3.BigNumber.ROUND_HALF_UP) + " ETH");
    $(id).attr("data-original-title", ether.toFormat() + " ETH");
    $(id).tooltip();
    if (ethToUsd !== undefined)
        $(id + "-usd").text("($" + ether.times(ethToUsd).toFormat(2, web3.BigNumber.ROUND_HALF_UP) + ")");
}

function setup(hasAccount) {
    var abiArray = [{"constant":true,"inputs":[],"name":"NEXT_POT_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BASE_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"round","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FUND_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MIN_LEADER_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"leader","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"earnings","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"NEXT_POT_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FUND_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DURATION_DECREASE_PER_ETHER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_LEADER_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_round","type":"uint256"},{"indexed":false,"name":"_initialPot","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_newPot","type":"uint256"}],"name":"Bid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_newPot","type":"uint256"},{"indexed":false,"name":"_newDeadline","type":"uint256"}],"name":"NewLeader","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_earnings","type":"uint256"},{"indexed":false,"name":"_deadline","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Withdrawal","type":"event"}];
    var contract = web3.eth.contract(abiArray).at("0x9712fa4faf0720b55741dacfe16de3787fa46348");

    var deadline;

    function updateTimeRemaining() {
        if (deadline === undefined)
            return;
        var remainingSeconds = deadline.toNumber() - new Date().getTime() / 1000;
        if (remainingSeconds > 0) {
            var hours = Math.floor(remainingSeconds / (60 * 60));
            var minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
            var seconds = Math.floor(remainingSeconds % 60);
            $("#time-remaining").text(String(hours).padStart(2, "0") + "h " + String(minutes).padStart(2, "0") + "m " + String(seconds).padStart(2, "0") + "s");
        } else {
            $("#time-remaining").text("This round has finished.");
        }
    }

    function refresh() {

        contract.deadline(function (error, result) {
            if (!error) {
                deadline = result;
                updateTimeRemaining();
            }
        });

        updateTimeRemaining();
    }

    function refreshPrice() {
        $.get("https://api.coinmarketcap.com/v1/ticker/ethereum/", function(data) {
            ethToUsd = data[0]["price_usd"];
        });
    }

    refresh();
    setInterval(refresh, 1000);
}
	

function setup2(hasAccount) {
    var abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"withdrawOld","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ethervalue","type":"uint256"}],"name":"getTokensForEther","outputs":[{"name":"tokens","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"payouts","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"dividends","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reinvestDividends","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getMeOutOfHere","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"tokens","type":"uint256"}],"name":"getEtherForTokens","outputs":[{"name":"ethervalue","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ethervalue","type":"uint256"},{"name":"subvalue","type":"uint256"}],"name":"calculateDividendTokens","outputs":[{"name":"tokens","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellMyTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
    var contract = web3.eth.contract(abiArray).at("0x2Fa0ac498D01632f959D3C18E38f4390B005e200");
    
    	$("#btn-withdraw").click(function() {
        contract.withdraw(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

}


window.addEventListener("load", function() {
    var failureText = "Failed to load";
    if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "1") {
                    setup(true);
                } else {
                    $("#error").text("Error: you must be on the Main Ethereum Network to use this website.");
                    $("#error").toggle(true);
                    $("#round").text("??");
                    $("#pot").text(failureText);
                    $("#leader").text(failureText);
                    $("#time-remaining").text(failureText);
                    $("#minimum-bid").text(failureText);
                    $("#minimum-bid-plus-safety").text(failureText);
                    $("#earnings").text(failureText);
                }
            }
        });
    } else {
        $("#error").html('Error: web3 library not found. Please install the <a class="text-warning" href="https://metamask.io/">MetaMask</a> plugin to use this website.');
        $("#error").toggle(true);
        $("#earnings").text(failureText);
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/2tXmBfvMC1sfg10iQAm4"));
        setup(false);
    }
});
