// Liberated from https://gist.github.com/andrei-m/982927
function _levenshtein(s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    let m = Math.max(s.length, t.length);
    let l = Math.min(
        _levenshtein(s.substr(1), t) + 1,
        _levenshtein(t.substr(1), s) + 1,
        _levenshtein(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;

    return (m - l) / m;
}

class Engagement {
    static engagements = [];

    constructor(id, date, title, service, univ, link, body) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.service = service;
        this.univ = univ
        this.link = link;
        this.body = body;
    }

    static fromId(id) {
        return Engagement.engagements.find(eng => id === eng.id);
    }

    static sortDate(a, b, asc) {
        let aDate = Date.parse(a.date);
        let bDate = Date.parse(b.date);

        return (aDate > bDate) ? (asc ? -1 : 1) : (bDate > aDate) ? (asc ? 1 : -1) : 0;
    }

    matchesUniv(univ) {
        return _levenshtein(univ.toLowerCase(), this.univ.toLowerCase()) > 0.65;
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
            .html(this.date + "<br><small>" + this.univ + "</small>");
        let card_body = $(document.createElement('div'))
            .addClass('card-body');
        let card_title = $(document.createElement('div'))
            .addClass('card-title')
            .text(this.title);
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
            .text('Go')

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

// development testing... replace by data via REST API.
$(document).ready(function () {
    let eng = new Engagement(
        -1, '2022-03-02', 'title',
        'Twitter', 'Durham', 'https://www.google.com', 'Hello! This is some engagement.'
    );

    let eng2 = new Engagement(
        -1, '2022-03-04', 'title',
        'Twitter', 'London', 'https://www.google.com', 'Hello! This is some engagement.'
    );

    appendEngagement(eng);
    appendEngagement(eng2);
});
