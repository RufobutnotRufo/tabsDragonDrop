import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Dashboard } from "./types";
import btnSvg from "../assets/Vector (9).svg";
import pinSvg from "../assets/Vector (10).svg";
import svg from "../assets/fi-rs-user-add (1).svg";

const TabsRender: React.FC = () => {
  const [tabs, setTabs] = useState<Dashboard[]>(() => {
    const savedTabs = localStorage.getItem("tabs");
    return savedTabs
      ? JSON.parse(savedTabs)
      : [
          { name: "Dashboard", secured: false, id: 1, content: "1" },
          { name: "Banking", secured: false, id: 2, content: "2" },
          { name: "Telephone", secured: false, id: 3, content: "3" },
          { name: "Accounting", secured: false, id: 4, content: "4" },
          { name: "Verkaf", secured: false, id: 5, content: "5" },
          { name: "Statistic", secured: false, id: 6, content: "6" },
          { name: "PostOffice", secured: false, id: 7, content: "7" },
          { name: "Administration", secured: false, id: 8, content: "8" },
          { name: "Help", secured: false, id: 9, content: "9" },
          { name: "Warenbestand", secured: false, id: 10, content: "10" },
          { name: "Auswahllisten", secured: false, id: 11, content: "11" },
          { name: "Einkauf", secured: false, id: 12, content: "12" },
          { name: "Rechn", secured: false, id: 13, content: "13" },
          { name: "Lagerverwaltung", secured: false, id: 14, content: "14" },
          { name: "Post Office", secured: false, id: 16, content: "16" },
          { name: "Telefonie", secured: false, id: 17, content: "17" },
        ];
  });

  const [hoveredTabId, setHoveredTabId] = useState<number | null>(null);

  const deleteTab = (id: number) => {
    setTabs((prevTabs) => {
      const updatedTabs: Dashboard[] = prevTabs.filter((tab) => tab.id !== id);
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const togglePinTab = (id: number) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab) =>
        tab.id === id ? { ...tab, secured: !tab.secured } : tab
      );
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceIndex = source.index;
    const destIndex = destination.index;

    const sourceList =
      source.droppableId === "pinnedTabs" ? "pinned" : "unpinned";
    const destinationList =
      destination.droppableId === "pinnedTabs" ? "pinned" : "unpinned";

    setTabs((prevTabs) => {
      const updatedPinnedTabs = prevTabs.filter((tab) => tab.secured);
      const updatedUnpinnedTabs = prevTabs.filter((tab) => !tab.secured);

      let movedTab;

      if (sourceList === "pinned") {
        movedTab = updatedPinnedTabs[sourceIndex];
        updatedPinnedTabs.splice(sourceIndex, 1);
      } else {
        movedTab = updatedUnpinnedTabs[sourceIndex];
        updatedUnpinnedTabs.splice(sourceIndex, 1);
      }

      if (destinationList === "pinned") {
        movedTab.secured = true;
        updatedPinnedTabs.splice(destIndex, 0, movedTab);
      } else {
        movedTab.secured = false;
        updatedUnpinnedTabs.splice(destIndex, 0, movedTab);
      }

      const newTabs = [...updatedPinnedTabs, ...updatedUnpinnedTabs];
      localStorage.setItem("tabs", JSON.stringify(newTabs));

      return newTabs;
    });
  };

  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  const pinnedTabs = tabs.filter((tab) => tab.secured);
  const unpinnedTabs = tabs.filter((tab) => !tab.secured);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="pinnedTabs">
        {(provided) => (
          <>
            <ul
              className="dashboard-block"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {pinnedTabs.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      className="dashboard-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onMouseEnter={() => setHoveredTabId(item.id)}
                      onMouseLeave={() => setHoveredTabId(null)}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: "none",
                        borderRadius: "0px",
                      }}
                    >
                      {item.name}
                      {hoveredTabId === item.id && (
                        <>
                          <button
                            className="delete-window"
                            onClick={() => deleteTab(item.id)}
                          >
                            <img src={btnSvg} alt="delete" />
                          </button>
                          <button
                            className="pin-btn"
                            onClick={() => togglePinTab(item.id)}
                            style={{
                              backgroundColor: item.secured ? "" : "green",
                              cursor: "pointer",
                            }}
                          >
                            {item.secured ? "Unp" : "Pin"}
                          </button>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
            <div className="content">{}</div>
          </>
        )}
      </Droppable>

      <Droppable droppableId="unpinnedTabs">
        {(provided) => (
          <ul
            className="dashboard-block"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {unpinnedTabs.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided) => (
                  <li
                    className="dashboard-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onMouseEnter={() => setHoveredTabId(item.id)}
                    onMouseLeave={() => setHoveredTabId(null)}
                    style={{
                      ...provided.draggableProps.style,
                      userSelect: "none",
                      borderRadius: "0px",
                      width: "180px",
                    }}
                  >
                    <img src={svg} />
                    <p className="dashboard-name">{item.name}</p>
                    {hoveredTabId === item.id && (
                      <>
                        <button
                          className="delete-window"
                          onClick={() => deleteTab(item.id)}
                        >
                          <img src={btnSvg} alt="delete" />
                        </button>
                        <button
                          className="pin-btn"
                          onClick={() => togglePinTab(item.id)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <div className="items-inner">
                            <div>
                              <img
                                src={pinSvg}
                                alt="svg-pin-btn"
                                className="pin-btn-svg"
                              />
                            </div>
                            <div>Tab'anpinnen</div>
                          </div>
                        </button>
                      </>
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TabsRender;
