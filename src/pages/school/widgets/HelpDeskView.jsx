import React, { useEffect } from 'react';
import { FormattedMessage, FormattedRelativeTime } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/pro-duotone-svg-icons';

// const DropdownCustomToggler = React.forwardRef((props, ref) => {
//   return (
//     <a
//       ref={ref}
//       className='btn btn-clean btn-hover-light-primary btn-sm btn-icon'
//       onClick={(e) => {
//         e.preventDefault();
//         props.onClick(e);
//       }}
//     >
//       {props.children}
//     </a>
//   );
// });

export const HelpDeskView = ({ className, lang, helpdeskIncidents, pullHelpdeskIncidents }) => {
  const { phase, incidents } = helpdeskIncidents;

  useEffect(() => {
    // Pull help desk incidents
    pullHelpdeskIncidents(lang);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    return phase !== 'PULLING' ? pullHelpdeskIncidents(lang) : null;
  };

  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className='card-header border-0'>
          <h3 className='card-title font-weight-bolder text-dark'>
            <FormattedMessage id='HELP_DESK' />
          </h3>
          <div className='card-toolbar'>
            <a
              href='#'
              className='btn btn-icon btn-light btn-sm'
              onClick={(e) => handleClick(e)}
              disabled={phase === 'PULLING'}
            >
              <span className='svg-icon svg-icon-primary'>
                <FontAwesomeIcon spin={phase === 'PULLING'} icon={faSync} />
              </span>
            </a>
          </div>
        </div>
        {/* Body */}
        <div className='card-body card-scroll h-500px pt-2'>
          {incidents &&
            incidents.length > 0 &&
            incidents.map((incident) => {
              return (
                <div key={incident.id} className='d-flex align-items-center mb-10'>
                  <span
                    className={`bullet bullet-bar bg-${incident.priorityColor} align-self-stretch`}
                  ></span>

                  <label
                    className={`checkbox checkbox-lg checkbox-light-${incident.priorityColor} checkbox-single flex-shrink-0 m-0 mx-4`}
                  >
                    <input type='checkbox' onChange={() => {}} value='1' />
                    <span></span>
                  </label>

                  <div className='d-flex flex-column flex-grow-1'>
                    <a
                      href='#'
                      className={`text-dark-75 text-hover-${incident.priorityColor} font-weight-bold font-size-lg mb-1`}
                    >
                      {incident.title}
                    </a>
                    <span className='text-muted font-weight-bold'>
                      {incident.issuedBy && incident.issuedAt && (
                        <FormattedMessage
                          id='HAS_BEEN_ADDED_ON_X_BY_Y'
                          defaultMessage='HAS_BEEN_ADDED_ON_X_BY_Y'
                          values={{
                            date: (
                              <FormattedRelativeTime
                                value={-incident.issuedAtAgo}
                                unit='day'
                                numeric='auto'
                              />
                            ),
                            user: incident.issuedBy.fullName
                          }}
                        />
                      )}
                      {incident.issuedBy && !incident.issuedAt && (
                        <FormattedMessage
                          id='HAS_BEEN_ADDED_BY_Y'
                          defaultMessage='HAS_BEEN_ADDED_BY_Y'
                          values={{
                            user: incident.issuedBy.fullName
                          }}
                        />
                      )}
                      {!incident.issuedBy && incident.issuedAt && (
                        <FormattedMessage
                          id='HAS_BEEN_ADDED_ON_X'
                          defaultMessage='HAS_BEEN_ADDED_ON_X'
                          values={{
                            date: (
                              <FormattedRelativeTime
                                value={-incident.issuedAtAgo}
                                unit='day'
                                numeric='auto'
                              />
                            )
                          }}
                        />
                      )}
                    </span>
                  </div>

                  {/* <IncidentDropdown incident={incident} /> */}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

// const IncidentDropdown = ({ incident }) => {
//   return (
//     <>
//       <Dropdown className='dropdown-inline' alignRight>
//         <Dropdown.Toggle
//           variant='transparent'
//           className={`btn btn-hover-light-${incident.priorityColor} btn-sm btn-icon`}
//           as={DropdownCustomToggler}
//         >
//           <i className='ki ki-bold-more-hor' />
//         </Dropdown.Toggle>
//         <Dropdown.Menu className='dropdown-menu dropdown-menu-sm dropdown-menu-right'>
//           <ul className='navi navi-hover'>
//             <li className='navi-header font-weight-bold py-5'>
//               <span className='font-size-lg'>{incident.title}</span>
//             </li>
//             <li className='navi-separator mb-3 opacity-70'></li>
//             <li className='navi-item px-6'>
//               <span className='navi-text'>{incident.explanation}</span>
//             </li>
//             <li className='navi-separator mt-3 opacity-70'></li>
//             <li className='navi-item'>
//               <a href='#' className='navi-link'>
//                 <span className='navi-text'>
//                   <span
//                     className={`label label-lg label-inline label-light-${incident.priorityColor}`}
//                   >
//                     {incident.priorityTitle}
//                   </span>
//                 </span>
//               </a>
//             </li>
//             <li className='navi-item'>
//               <a href='#' className='navi-link'>
//                 <span className='navi-text'>
//                   <span className='label label-lg label-inline label-light-dark'>
//                     {incident.incidentType}
//                   </span>
//                 </span>
//               </a>
//             </li>
//           </ul>
//         </Dropdown.Menu>
//       </Dropdown>
//     </>
//   );
// };
