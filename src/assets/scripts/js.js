class Engagement {
    static engagements = [];

    constructor(id, date, title, service, link, body) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.service = service;
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
            .text(this.date);
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

    list.children().sort(function(a, b) {
        let aId = parseInt($(a).data('engagement-id'));
        let bId = parseInt($(b).data('engagement-id'));

        return Engagement.sortDate(
            Engagement.fromId(aId),
            Engagement.fromId(bId),
            asc
        );
    }).appendTo(list);
}

// register events
$(document).ready(function() {
    $('#filter-menu').find('a').each(function() {
        let asc = $(this).data('dropdown-id') === "asc";

        $(this).click(function() {
            sortDate(asc);
        });
    });
});

// development testing... replace by data via REST API.
$(document).ready(function() {
    let eng = new Engagement(
        -1, '2022-03-02', 'title',
        'Twitter', 'https://www.google.com', 'Hello! This is some engagement.'
    );

    let eng2 = new Engagement(
        -1, '2022-03-04', 'title',
        'Twitter', 'https://www.google.com', 'Hello! This is some engagement.'
    );

    appendEngagement(eng);
    appendEngagement(eng2);
});
