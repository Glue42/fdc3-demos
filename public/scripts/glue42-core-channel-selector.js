window.createChannelSelectorWidget = (
  NO_CHANNEL_VALUE,
  channelNamesAndColors,
  onChannelSelected,
  theme = "dark"
) => {
  const isDarkTheme = theme === "dark";

  // Create a custom channel selector widget.
  $.widget("custom.channelSelectorWidget", $.ui.selectmenu, {
    // Create a button that will have the background of the current channel.
    _renderButtonItem: item => {
      const buttonItem = $("<span>", {
        class: "ui-selectmenu-text",
        html: isDarkTheme ? `
        <svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
          <path d="M5.712 6.96l.167-.167a1.99 1.99 0 0 1 .896-.518 1.99 1.99 0 0 1 .518-.896l.167-.167A3.004 3.004 0 0 0 6 5.499c-.22.46-.316.963-.288 1.46z" />
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z" />
          <path d="M10 9.5a2.99 2.99 0 0 0 .288-1.46l-.167.167a1.99 1.99 0 0 1-.896.518 1.99 1.99 0 0 1-.518.896l-.167.167A3.004 3.004 0 0 0 10 9.501z" />
        </svg>` : "🔗"
      }).css({
        textAlign: "center"
      });

      const color = item.element.attr("color") || (isDarkTheme ? "transparent" : "#f5f5f5");
      const channelSelectorWidgetButtonElement = $("#channel-selector-widget-button");
      channelSelectorWidgetButtonElement.css("background-color", color);

      return buttonItem;
    },
    // Inside the channel selector widget menu display an item for each channel that has the channel name and color.
    _renderItem: (ul, item) => {
      const li = $("<li>");

      const wapperDivStyling = isDarkTheme ?
        {
          paddingLeft: "32px",
          lineHeight: "130%"
        }
        :
        {
          padding: "2px 0 2px 48px",
          lineHeight: "1.5"
        };
      const iconSpanStyling = isDarkTheme ?
        {
          backgroundColor: item.element.attr("color"),
          position: "absolute",
          bottom: 0,
          left: "7px",
          margin: "auto 0",
          height: "16px",
          width: "16px",
          top: "1px",

        }
        :
        {
          backgroundColor: item.element.attr("color"),
          position: "absolute",
          bottom: 0,
          left: "3px",
          margin: "auto 0",
          height: "24px",
          width: "24px",
          top: "1px"
        };

      const wrapper = $("<div>", {
        text: item.value
      }).css(wapperDivStyling);
      $("<span>", {
        class: "icon"
      })
        .css(iconSpanStyling)
        .appendTo(wrapper);

      return li.append(wrapper).appendTo(ul);
    }
  });

  const channelSelectorWidgetElement = $("#channel-selector-widget");

  channelSelectorWidgetElement.channelSelectorWidget({
    // Whenever an item inside the channel selector widget menu is selected join the corresponding channel (or leave the current channel if NO_CHANNEL_VALUE is selected).
    select: (event, ui) => {
      // Do not call onChannelSelected when the channel is changed programmatically.
      if (event.originalEvent.type === "menuselect") {
        onChannelSelected(ui.item.value);
      }
    }
  });

  const channelSelectorWidgetButtonStyling = isDarkTheme ?
    {
      width: "2rem",
      textAlign: "center",
      borderColor: "transparent",
      padding: 0
    }
    :
    {
      width: "148px",
      height: "28px",
      alignSelf: "center",
      textAlign: "center",
      padding: 0
    };

  $("#channel-selector-widget-button").css(channelSelectorWidgetButtonStyling);

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
    channelSelectorWidgetElement.channelSelectorWidget("refresh", true);
  };
};

(async () => {
  // Hide the channel selector widget when running inside of an Electron container.
  const isGlue42Enterprise = navigator.userAgent.toLowerCase().includes(" electron/");
  if (isGlue42Enterprise) {
    $(document).ready(() => {
      $("#channel-selector-widget").parent().css("display", "none");
    });

    return;
  }

  // The value that will be displayed inside the channel selector widget to leave the current channel.
  const NO_CHANNEL_VALUE = "No channel";

  // Get the channel names and colors using the Channels API.
  const channelContexts = await window.fdc3.getSystemChannels();
  const channelNamesAndColors = channelContexts.sort((channelContextA, channelContextB) => channelContextA.id.localeCompare(channelContextB.id)).map(channelContext => ({
    name: channelContext.id,
    color: channelContext.displayMetadata.color
  }));

  const onChannelSelected = async (channelName) => {
    if (channelName === NO_CHANNEL_VALUE) {
      const currentChannel = await window.fdc3.getCurrentChannel()
      if (typeof currentChannel !== "undefined") {
        window.fdc3.leaveCurrentChannel().catch(console.error);
      }
    } else {
      window.fdc3.joinChannel(channelName).catch(console.error);
    }
  };

  const rerenderChannels = window.createChannelSelectorWidget(
    NO_CHANNEL_VALUE,
    channelNamesAndColors,
    onChannelSelected,
    location.href.split("/")[3].startsWith("fdc3_") ? "light" : "dark"
  );

  const intervalId = setInterval(() => {
    if (typeof window.glue !== "undefined") {
      clearInterval(intervalId);

      // Whenever a channel is joined or left rerender the channels.
      window.glue.channels.onChanged((channelName) => {
        rerenderChannels(channelName || NO_CHANNEL_VALUE, channelNamesAndColors, onChannelSelected);
      });
    }
  }, 1000);
})();
