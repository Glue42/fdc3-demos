window.createChannelSelectorWidget = (
  NO_CHANNEL_VALUE,
  channelNamesAndColors,
  onChannelSelected
) => {
  // Create a custom channel selector widget.
  $.widget("custom.channelSelectorWidget", $.ui.selectmenu, {
    // Create a button that will have the background of the current channel.
    _renderButtonItem: item => {
      const buttonItem = $("<span>", {
        class: "ui-selectmenu-text",
        html: "🔗"
      }).css({
        textAlign: "center"
      });

      const color = item.element.attr("color") || "transparent";
      const channelSelectorWidgetButtonElement = $("#channel-selector-widget-button");
      channelSelectorWidgetButtonElement.css('background-color', color);

      return buttonItem;
    },
    // Inside the channel selector widget menu display an item for each channel that has the channel name and color.
    _renderItem: (ul, item) => {
      const li = $("<li>");
      const wrapper = $("<div>", {
        text: item.value
      }).css({
        paddingLeft: "32px",
        lineHeight: "130%"
      });
      $("<span>", {
        class: "icon"
      })
        .css({
          backgroundColor: item.element.attr("color"),
          position: "absolute",
          bottom: 0,
          left: "7px",
          margin: "auto 0",
          height: "16px",
          width: "16px",
          top: "1px",
      
        })
        .appendTo(wrapper);

      return li.append(wrapper).appendTo(ul);
    }
  });

  const channelSelectorWidgetElement = $("#channel-selector-widget");

  channelSelectorWidgetElement.channelSelectorWidget({
    // Whenever an item inside the channel selector widget menu is selected join the corresponding channel (or leave the current channel if NO_CHANNEL_VALUE is selected).
    select: (_, ui) => onChannelSelected(ui.item.value)
  });

  $("#channel-selector-widget-button").css({
    width: "2rem",
    height: "1.5rem",
    textAlign: "center",
    borderColor: "transparent",
    padding: 0
  });

  // Add the option to leave the current channel.
  channelSelectorWidgetElement.append(
    $("<option>", {
      value: NO_CHANNEL_VALUE
    })
  );

  // Add an item for each channel to the channel selector widget menu.
  $.each(channelNamesAndColors, (_, channelNameAndColor) => {
    channelSelectorWidgetElement.append(
      $("<option>", {
        value: channelNameAndColor.name,
        attr: {
          color: channelNameAndColor.color
        }
      })
    );
  });

  // Return a method that would allow the update of the channel programmatically.
  return (channelName) => {
    channelSelectorWidgetElement.val(channelName);
    channelSelectorWidgetElement.channelSelectorWidget('refresh', true);
  };
};

window.gluePromise.then(async () => {
  // The value that will be displayed inside the channel selector widget to leave the current channel.
  const NO_CHANNEL_VALUE = 'No channel';

  // Get the channel names and colors using the Channels API.
  const channelContexts = await window.glue.channels.list();
  const channelNamesAndColors = channelContexts.sort((channelContextA, channelContextB) => channelContextA.name.localeCompare(channelContextB.name)).map(channelContext => ({
    name: channelContext.name,
    color: channelContext.meta.color
  }));

  const onChannelSelected = (channelName) => {
    if (channelName === NO_CHANNEL_VALUE) {
      if (window.glue.channels.my()) {
        window.glue.channels.leave().catch(console.error);
      }
    } else {
      window.glue.channels.join(channelName).catch(console.error);
    }
  };

  const rerenderChannels = createChannelSelectorWidget(
    NO_CHANNEL_VALUE,
    channelNamesAndColors,
    onChannelSelected
  );

  // Whenever a channel is joined or left rerender the channels.
  window.glue.channels.onChanged((channelName) => {
    rerenderChannels(channelName || NO_CHANNEL_VALUE, channelNamesAndColors, onChannelSelected);
  });
});
