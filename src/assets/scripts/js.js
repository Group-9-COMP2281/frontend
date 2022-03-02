class Engagement {
    constructor(id, date, title, service, link, body) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.service = service;
        this.link = link;
        this.body = body;
    }

    #createEngagementDiv() {
        return $(document.createElement('div'))
            .attr('engagement-id', this.id)
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

$(document).ready(function() {
    for (let i = 0; i < 20; i++) {
        let eng = new Engagement(i, '3/2/22', 'title', 'Twitter', 'https://www.google.com', 'Hello! This is some engagement.')
        let listing = eng.createEngagementListing();

        $('#engagements').append(listing);
    }
});
