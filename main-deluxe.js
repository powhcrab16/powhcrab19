function displayWei(id, wei, ethToUsd) {
    ether = web3.fromWei(wei, "ether");
    $(id).text(ether.toFormat(5, web3.BigNumber.ROUND_HALF_UP) + " ETH");
    $(id).attr("data-original-title", ether.toFormat() + " ETH");
    $(id).tooltip();
    if (ethToUsd !== undefined)
        $(id + "-usd").text("($" + ether.times(ethToUsd).toFormat(2, web3.BigNumber.ROUND_HALF_UP) + ")");
}

function setup(hasAccount) {
    var abiArray = [{"constant":true,"inputs":[],"name":"NEXT_POT_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BASE_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"round","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"dividendFund","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawDividends","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MIN_LEADER_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"leader","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"earnings","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DEVELOPER_FEE_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"NEXT_POT_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawEarnings","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"DIVIDEND_FUND_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDividendShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DIVIDEND_FUND_FRAC_TOP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DEVELOPER_FEE_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DURATION_DECREASE_PER_ETHER","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dividendShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_LEADER_FRAC_BOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_round","type":"uint256"},{"indexed":false,"name":"_initialPot","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_newPot","type":"uint256"}],"name":"Bid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_newPot","type":"uint256"},{"indexed":false,"name":"_newDeadline","type":"uint256"}],"name":"NewLeader","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_earnings","type":"uint256"},{"indexed":false,"name":"_deadline","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"EarningsWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_timestamp","type":"uint256"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_dividendShares","type":"uint256"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_newTotalDividendShares","type":"uint256"},{"indexed":false,"name":"_newDividendFund","type":"uint256"}],"name":"DividendsWithdrawal","type":"event"}];
    var contract = web3.eth.contract(abiArray).at("0xb3d5b5cea80ac61083ec9948b4b507a0f22df71a");

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
    var earnings;
    var dividendShares;
    var totalDividendShares;
    var dividendFund;

    $("#btn-minimum-bid").click(function() {
        contract.bid({value: minimumBid}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-multiple-of-minimum-bid").click(function() {
	var multiple = parseInt($("#multiple-of-minimum-bid").val());
	if (minimumBid !== undefined && !isNaN(multiple) && multiple >= 0) {
	    var bid = minimumBid.times(multiple);
	    contract.bid({value: bid}, function(error, result) {
		if (!error)
		    console.log(result)
	    });
	}
    });

    $("#btn-custom-bid").click(function() {
        var customBid = web3.toWei($("#custom-bid").val(), "ether");
	if (customBid < minimumBid) {
	    alert("Warning: Your custom bid of " + $("#custom-bid").val() + " ETH is smaller than the minimum bid of " + web3.fromWei(minimumBid, "ether").toFormat() + " ETH. You will not become the new leader if you proceed.");
	}
        contract.bid({value: customBid}, function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-withdraw-earnings").click(function() {
        contract.withdrawEarnings(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    $("#btn-withdraw-dividends").click(function() {
        contract.withdrawDividends(function(error, result) {
            if (!error)
                console.log(result);
        });
    });

    function updateBids() {
        if (MIN_LEADER_FRAC_TOP === undefined || MIN_LEADER_FRAC_BOT === undefined || pot === undefined)
            return;
        if (hasAccount) {
            $("#btn-minimum-bid").prop("disabled", false);
	    $("#multiple").prop("disabled", false);
            $("#btn-multiple-of-minimum-bid").prop("disabled", false);
            $("#custom-bid").prop("disabled", false);
            $("#btn-custom-bid").prop("disabled", false);
        }
        minimumBid = pot.times(MIN_LEADER_FRAC_TOP).dividedToIntegerBy(MIN_LEADER_FRAC_BOT);
        displayWei("#minimum-bid", minimumBid);
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

    function updateDividends() {
        if (dividendShares === undefined || totalDividendShares === undefined || dividendFund === undefined)
	    return;
	if (hasAccount)
	    $("#btn-withdraw-dividends").prop("disabled", false);
	var dividends = totalDividendShares == 0 ? new web3.BigNumber(0) : dividendFund.times(dividendShares).dividedToIntegerBy(totalDividendShares);
	displayWei("#dividends", dividends);
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
                updateBids();
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
            }
        });

        if (hasAccount) {
            contract.earnings(web3.eth.defaultAccount, function (error, result) {
                if (!error) {
                    displayWei("#earnings", result);
                    $("#btn-withdraw-earnings").prop("disabled", false);
                }
            });
        }

        if (hasAccount) {
            contract.dividendShares(web3.eth.defaultAccount, function (error, result) {
                if (!error) {
		    dividendShares = result;
		    $("#dividend-shares").text(result.toFormat());
                }
            });
        }

        contract.totalDividendShares(function (error, result) {
            if (!error) {
                totalDividendShares = result;
		$("#total-dividend-shares").text(result.toFormat());
            }
        });

        contract.dividendFund(function (error, result) {
            if (!error) {
                dividendFund = result;
		displayWei("#dividend-fund", result);
            }
        });

        updateBids();
	updateTimeRemaining();
	updateDividends();
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
    var failureText = "Cannot load";
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
                    $("#earnings").text(failureText);
		    $("#dividend-shares").text(failureText);
		    $("#total-dividend-shares").text(failureText);
		    $("#dividends").text(failureText);
		    $("#dividend-fund").text(failureText);
                }
            }
        });
    } else {
        $("#error").html('Error: web3 library not found. Please install the <a class="text-warning" href="https://metamask.io/">MetaMask</a> plugin to use this website.');
        $("#error").toggle(true);
        $("#earnings").text(failureText);
	$("#dividend-shares").text(failureText);
	$("#dividends").text(failureText);
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/2tXmBfvMC1sfg10iQAm4"));
        setup(false);
    }
});
