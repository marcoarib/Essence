'use strict';

var React = require('react'),
    Icon = require('./Icon'),
    PubSub = require('../utils/PubSub'),
    Highlighter = require('./Highlighter'),
    ClassNames = require('../utils/ClassNames'),
    classSet = require('classnames');

module.exports = React.createClass({
  displayName: 'TabMenu',

  mixins: [PubSub],

  getInitialState: function getInitialState() {
    return {
      highlighterCSS: {
        left: 0,
        width: 'auto',
        Highlighter: false
      }
    };
  },

  initActiveItem: function initActiveItem(id) {
    if (id) {
      this.setState({
        activeItem: id
      });
    }
  },

  setActiveItem: function setActiveItem(data) {
    this.setState({
      activeItem: data.activeItem,
      highlighterCSS: data.highlighterCSS,
      highlighterId: this.props.type + '-' + this.props.id,
      highlighter: data.highlighter
    });
  },

  isActiveItem: function isActiveItem(item) {
    var self = this,
        index = item.props.id;

    if (self.state.activeItem === index) {
      return 'active';
    } else if (item.props.disabled) {
      return 'disabled';
    }

    return '';
  },

  componentDidMount: function componentDidMount() {
    this.subscribe('menu:activeItem', this.setActiveItem);
  },

  componentWillUnmount: function componentWillUnmount() {
    this.unsubscribe('menu:activeItem', this.setActiveItem);
  },

  renderItems: function renderItems() {
    var self = this,
        children = {
      'list': [],
      'content': []
    };

    self.props.children.map(function (item, index) {
      var itemID = self.props.id + '-' + item.props.id;

      item = React.cloneElement(item, {
        parentId: self.props.id,
        parentType: self.props.type,
        key: item.props.type + '-' + itemID
      });

      if (!self.state.activeItem && (index === 0 && item.props.type === 'list' || index === 1 && item.props.type === 'content')) {
        item.props.active = true;
      } else if (itemID === self.state.activeItem) {
        item.props.active = true;
      } else {
        item.props.active = false;
      }

      if (item.props.type === 'list') {
        children.list.push(item);
      }

      if (item.props.type === 'content') {
        children.content.push(item);
      }
    });

    if (children.list.length > 0 || children.content.length > 0) {
      return children;
    }

    return '';
  },

  renderScrollable: function renderScrollable(position) {
    var self = this;

    if (self.props.type === 'scrollable' && position) {
      if (position === 'left') {
        return React.createElement(
          'a',
          { className: 'e-tabs-scroller left', href: '#' },
          React.createElement(Icon, { name: 'navigation-chevron-left' })
        );
      }

      if (position === 'right') {
        return React.createElement(
          'a',
          { className: 'e-tabs-scroller right', href: '#' },
          React.createElement(Icon, { name: 'navigation-chevron-right' })
        );
      }
    }

    return '';
  },

  render: function render() {
    var self = this,
        items = self.renderItems(),
        highlighterCSS = self.state.highlighterId === self.props.type + '-' + self.props.id ? self.state.highlighterCSS : '',
        nextCSS = {
      left: self.state.nextLeft,
      width: self.state.nextWidth
    },
        classes = {
      'e-tabs': true,
      'e-background-cyan-500': true,
      'e-text-grey-50': true
    },
        classList = classSet(ClassNames(classes, self.props.classes));

    return React.createElement(
      'div',
      null,
      React.createElement(
        'nav',
        { className: classList + ' ' + self.props.type },
        self.renderScrollable('left'),
        self.renderScrollable('right'),
        React.createElement(Highlighter, {
          id: self.props.id,
          css: highlighterCSS,
          nextCSS: nextCSS
        }),
        React.createElement(
          'ul',
          { className: 'e-tabs-list e-row' },
          items.list
        )
      ),
      React.createElement(
        'div',
        { className: 'e-tabs-container' },
        items.content
      )
    );
  }
});