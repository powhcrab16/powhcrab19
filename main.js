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

    var MIN_LEADER_FRAC_TOP;
    var MIN_LEADER_FRAC_BOT;

    contract.MIN_LEADER_FRAC_TOP(function (error, result) {
        if (!error)
            MIN_LEADER_FRAC_TOP = result
    });

    contract.MIN_LEADER_FRAC_BOT(function (error, result) {
        if (!error)
            MIN_LEADER_FRAC_BOT = result
    });

    var ethToUsd;
    var round;
    var pot;
    var leader;
    var deadline;
    var minimumBid;
    var minimumBidPlusSafety;
    var earnings;

    $("#btn-minimum-bid").click(function() {
        contract.bid({value: minimumBid}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-minimum-bid-plus-safety").click(function() {
        contract.bid({value: minimumBidPlusSafety}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-custom-bid").click(function() {
        var customBid = web3.toWei($("#custom-bid").val(), "ether");
        contract.bid({value: customBid}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-withdraw").click(function() {
        contract.withdraw(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    function updateMinimumBids() {
        if (MIN_LEADER_FRAC_TOP === undefined || MIN_LEADER_FRAC_BOT === undefined || pot === undefined)
            return;
        if (hasAccount) {
            $("#btn-minimum-bid").prop("disabled", false);
            $("#btn-minimum-bid-plus-safety").prop("disabled", false);
            $("#custom-bid").prop("disabled", false);
            $("#btn-custom-bid").prop("disabled", false);
        }
        minimumBid = pot.times(MIN_LEADER_FRAC_TOP).dividedToIntegerBy(MIN_LEADER_FRAC_BOT);
        minimumBidPlusSafety = minimumBid.times(101).dividedToIntegerBy(100);
        displayWei("#minimum-bid", minimumBid);
        displayWei("#minimum-bid-plus-safety", minimumBidPlusSafety);
    };

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
            $("#time-remaining").text("This round has finished. Make a bid of 0 ETH to start the next round.");
        }
    }

    function refresh() {
        contract.round(function (error, result) {
            if (!error) {
                round = result;
                $("#round").text(result.toFormat());
            }
        });

        contract.pot(function (error, result) {
            if (!error) {
                pot = result;
                displayWei("#pot", result, ethToUsd);
                updateMinimumBids();
            }
        });

        contract.leader(function (error, result) {
            if (!error) {
                leader = result;
                var numChars = 10;
                var abbreviatedAddress = result.substring(0, 2 + numChars) + "..." + result.substring(result.length - numChars);
                var url = "https://etherscan.io/address/" + result;
                $("#leader").html('<a href="' + url + '">' + abbreviatedAddress + "</a>");
            }
        });

        contract.deadline(function (error, result) {
            if (!error) {
                deadline = result;
                updateTimeRemaining();
            }
        });

        if (hasAccount) {
            contract.earnings(web3.eth.defaultAccount, function (error, result) {
                if (!error) {
                    displayWei("#earnings", result);
                    $("#btn-withdraw").prop("disabled", false);
                }
            });
        }

        updateMinimumBids();
        updateTimeRemaining();
    }

    function refreshPrice() {
        $.get("https://api.coinmarketcap.com/v1/ticker/ethereum/", function(data) {
            ethToUsd = data[0]["price_usd"];
        });
    }

    refresh();
    setInterval(refresh, 1000);

    refreshPrice();
    setInterval(refreshPrice, 1000 * 60);
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
