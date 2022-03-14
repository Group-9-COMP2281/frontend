// Liberated from https://gist.github.com/andrei-m/982927
// function _levenshtein(s, t) {
//     if (!s.length) return t.length;
//     if (!t.length) return s.length;
//
//     let m = Math.max(s.length, t.length);
//     let l = Math.min(
//         _levenshtein(s.substr(1), t) + 1,
//         _levenshtein(t.substr(1), s) + 1,
//         _levenshtein(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
//     ) + 1;
//
//     return (m - l) / m;
// }

function isIn(s, t) {
    s = s.toLowerCase()
    t = t.toLowerCase()

    return t.includes(s);
}

class EngagementRequest {
    static url = "localhost:8080";

    constructor(min_id) {
        this.min_id = min_id;
    }

    doRequest(callback) {
        let url = `http://${EngagementRequest.url}/api/engagements`;

        if (this.min_id !== -1) {
            url += `?min_id=${this.min_id}`
        }

        $.ajax({
            url: url,
            crossDomain: true,
            crossOrigin: true,
            success: function(data) {
                data = data['posts']
                data = data.map(function(e) {

                    return new Engagement(e['post_id'], new Date(e['posted']), e['service'], e['univ'], e['url'], e['content'])
                })

                callback(data);
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
}

class Engagement {
    static engagements = [];

    constructor(id, date, service, univ, link, body) {
        this.id = id;
        this.date = date;
        this.service = service;
        this.univ = univ
        this.link = link;
        this.body = body;
    }

    static fromId(id) {
        return Engagement.engagements.find(eng => id === eng.id);
    }

    static sortDate(a, b, asc) {
        let aDate = a.date;
        let bDate = b.date;

        return (aDate > bDate) ? (asc ? 1 : -1) : (bDate > aDate) ? (asc ? -1 : 1) : 0;
    }

    matchesUniv(univ) {
        // return _levenshtein(univ.toLowerCase(), this.univ.toLowerCase()) > 0.90;
        return isIn(univ, this.univ)
    }

    #createEngagementDiv() {
        return $(document.createElement('div'))
            .data('engagement-id', this.id)
            .addClass('col-sm-12')
            .addClass('col-md-6')
            .addClass('mb-3')
            .addClass('engagement');
    }

    #createEngagementCard() {
        let card = $(document.createElement('div')).addClass('card');
        let card_header = $(document.createElement('div'))
            .addClass('card-header')
            .html(this.date.toLocaleDateString('en-gb', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        let card_body = $(document.createElement('div'))
            .addClass('card-body');
        let card_title = $(document.createElement('div'))
            .addClass('card-title')
            .text(this.univ);
        let card_subtitle = $(document.createElement('p'))
            .addClass('card-subtitle')
            .addClass('text-muted')
            .text('via ' + this.service);
        let card_text = $(document.createElement('p'))
            .addClass('card-text')
            .text(this.body);
        let card_link = $(document.createElement('a'))
            .addClass('card-link')
            .attr('href', this.link)
            .attr('target', '_blank')
            .text('Visit')

        card_body.append(card_title);
        card_body.append(card_subtitle);
        card_body.append($(document.createElement('br')));
        card_body.append(card_text);
        card_body.append(card_link);

        card.append(card_header);
        card.append(card_body);

        return card;
    }

    createEngagementListing() {
        let outer = this.#createEngagementDiv();
        let inner = this.#createEngagementCard();

        outer.append(inner);
        return outer;
    }
}

function appendEngagement(eng) {
    if (eng.id === -1) {
        eng.id = Engagement.engagements.length;
    }

    let listing = eng.createEngagementListing();
    Engagement.engagements.push(eng);

    $('#engagements').append(listing);
}

function sortDate(asc) {
    let list = $('#engagements');

    list.children().sort(function (a, b) {
        let aId = parseInt($(a).data('engagement-id'));
        let bId = parseInt($(b).data('engagement-id'));

        return Engagement.sortDate(
            Engagement.fromId(aId),
            Engagement.fromId(bId),
            asc
        );
    }).appendTo(list);
}

function filterUniv(univ) {
    let divs = []
    let filtered;

    if (univ.trim() === "") {
        filtered = Engagement.engagements;
    } else {
        filtered = Engagement.engagements.filter(function (e) {
            return e.matchesUniv(univ);
        });
    }

    filtered.forEach(function (e) {
        divs.push(e.createEngagementListing());
    });

    $('#engagements').html(divs);
}

$(document).ready(function() {
    new EngagementRequest(-1).doRequest(function(data) {
        data.forEach(function(eng) {
            appendEngagement(eng)
        })
    });
});

// register events sorting
$(document).ready(function () {
    $('#filter-menu').find('a').each(function () {
        let asc = $(this).data('dropdown-id') === "asc";

        $(this).click(function () {
            sortDate(asc);
        });
    });
});

// register events filtering
$(document).ready(function() {
    let typingTimer;
    let doneTypingInterval = 250;

    $('#university-filter').keyup(function(){
        clearTimeout(typingTimer);

        typingTimer = setTimeout(function() {
            filterUniv($('#university-filter').val())
        }, doneTypingInterval);
    });
});
