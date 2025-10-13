import React, { useState } from 'react';
import { useDnD } from '@/hooks/DnDContext';

export default function NodesPanel() {
  const [_, setType] = useDnD();
  const commonNodeSectionClassNames = 'flex items-start px-3 h-[22px] text-xs font-medium text-gray-500'
  const commonNodeClassNames = 'flex items-center px-3 w-full h-6 rounded-lg hover:bg-gray-50 cursor-pointer'
  const commonNodeCenterClassNames = 'flex items-center justify-center border-transparent border-white/2 text-white w-5 h-5 rounded-md shadow-xs bg-util-colors-blue-blue-500 mr-2 shrink-0'

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="rounded-lg border-[0.5px] border-gray-200 bg-white shadow-lg !min-w-[256px] dark:bg-boxdark">
      <div
        className={`flex items-center px-3 h-[34px] text-[13px] font-medium cursor-pointer ${isCollapsed ? "text-gray-700" : "border-b-[0.5px] border-b-black/5"
          }`}
        onClick={toggleCollapse}
      >
        <span className="relative">
          Tools
          {isCollapsed && (
            <span className="ml-2 text-xs text-gray-500">(Click to Expand)</span>
          )}

          {!isCollapsed && (<button
            className="text-gray-500 hover:text-gray-700 ml-2"
            onClick={toggleCollapse}
          >

          </button>)}
        </span>
      </div>

      {!isCollapsed && (
        <div>
          {/* <div className="px-2 pt-2 flex justify-between items-center">
            <div className="relative w-full">
              <input
                className="w-full py-[7px] bg-components-input-bg-normal border border-transparent text-components-input-text-filled hover:bg-components-input-bg-hover hover:border-components-input-border-hover focus:bg-components-input-bg-active focus:border-components-input-border-active focus:shadow-xs placeholder:text-components-input-text-placeholder appearance-none outline-none caret-primary-600 px-3 radius-md system-sm-regular pl-[26px]"
                placeholder="Search block"
                value=""
                data-tabindex=""
                tabIndex="-1"
              />
            </div>
          </div> */}
          <div className="p-1">
            <div className="mb-1 last-of-type:mb-0">
              <div className={`${commonNodeSectionClassNames}`}>Flow</div>
              <div onDragStart={(event) => onDragStart(event, 'start')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className="flex items-center justify-center border-transparent border-white/2 text-white w-5 h-5 rounded-md shadow-xs bg-util-colors-indigo-indigo-500 mr-2 shrink-0"></div>
                <div className="text-sm text-gray-900">
                  Start
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'end')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className="flex items-center justify-center border-transparent border-white/2 text-white w-5 h-5 rounded-md shadow-xs bg-util-colors-indigo-indigo-500 mr-2 shrink-0"></div>
                <div className="text-sm text-gray-900">
                  End
                </div>
              </div>
            </div>
            <div className="mb-1 last-of-type:mb-0">
              <div className={`${commonNodeSectionClassNames}`}>Logic</div>
              <div onDragStart={(event) => onDragStart(event, 'conditional')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className="flex items-center justify-center border-transparent border-white/2 text-white w-5 h-5 rounded-md shadow-xs bg-util-colors-cyan-cyan-500 mr-2 shrink-0"></div>
                <div className="text-sm text-gray-900">IF/ELSE</div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'emailconditional')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className="flex items-center justify-center border-transparent border-white/2 text-white w-5 h-5 rounded-md shadow-xs bg-util-colors-cyan-cyan-500 mr-2 shrink-0"></div>
                <div className="text-sm text-gray-900">Email Conditional</div>
              </div>
            </div>
            <div className="mb-1 last-of-type:mb-0">
              <div className={`${commonNodeSectionClassNames}`}>Questions</div>
              <div onDragStart={(event) => onDragStart(event, 'dropDown')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Drop Down
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'date')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Date
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'time')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Time
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'dateTime')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  DateTime
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'address')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Address
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'payment')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Payments
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'number')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Number
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'clickList')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  ClickList
                </div>
              </div>
              <div onDragStart={(event) => onDragStart(event, 'sendemail')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Send Email
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'email')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Email
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'phone')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Phone
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'input')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Input
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'message')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Message
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'radio')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Radio
                </div>
              </div>

              <div onDragStart={(event) => onDragStart(event, 'button')} draggable className={`${commonNodeClassNames}`} data-state="closed">
                <div className={`${commonNodeCenterClassNames}`}></div>
                <div className="text-sm text-gray-900">
                  Button
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
