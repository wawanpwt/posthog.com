import React, { useState, useEffect } from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { ResponsiveSidebar } from '../ResponsiveSidebar'
import { Container } from '../Container'
import ResponsiveAnchor from '../ResponsiveAnchor'
import ResponsiveTopBar from '../ResponsiveTopBar'
import { default as AntdLayout } from 'antd/lib/layout'
import NewsletterForm from '../NewsletterForm'
import { useValues } from 'kea'
import { layoutLogic } from '../../logic/layoutLogic'
import { DocsSearch } from '../DocsSearch'
import { DarkModeToggle } from '../../components/DarkModeToggle'
import { Spacer } from '../../components/Spacer'
import './Layout.scss'
import './DarkMode.scss'
import { CloseOutlined } from '@ant-design/icons'

const Layout = ({
    onPostPage,
    pageTitle,
    isDocsPage,
    isHomePage,
    isBlogArticlePage,
    children,
    className,
    containerStyle = {},
}) => {
    const { sidebarHide, anchorHide } = useValues(layoutLogic)
    const [showAnnouncement, setShowAnnouncement] = useState(false)

    useEffect(() => {
        if (window && !localStorage.getItem('hide-announcement')) {
            setShowAnnouncement(true)
        }
    }, [])

    const stopAnnouncement = (e, source) => {
        if (source === 'close') {
            e.preventDefault()
            e.stopPropagation()
        }
        setShowAnnouncement(false)
        localStorage.setItem('hide-announcement', '1')
        if (window) {
            window.posthog.capture(source === 'link' ? 'clicked_announcement' : 'closed_announcement', {
                announcement_type: 'series a',
            })
        }
    }
    return (
        <StaticQuery
            query={graphql`
                query SiteTitleQuery {
                    site {
                        siteMetadata {
                            title
                        }
                    }
                }
            `}
            render={(data) => {
                return (
                    <>
                        <AntdLayout id="antd-main-layout-wrapper" hasSider>
                            {onPostPage && !sidebarHide && !isBlogArticlePage && (
                                <AntdLayout.Sider
                                    width="300"
                                    className="sideBar display-desktop"
                                    id="docs-sidebar"
                                    style={{ background: '#f9f9f9' }}
                                >
                                    <ResponsiveSidebar />
                                </AntdLayout.Sider>
                            )}
                            <AntdLayout id="ant-layout-content-wrapper" style={{ background: '#ffffff' }}>
                                <AntdLayout.Header
                                    className={
                                        'menuHeader ' +
                                        (onPostPage && 'docsHeader ') +
                                        (isBlogArticlePage && 'blogHeader')
                                    }
                                    id="menu-header"
                                    style={{ background: '#ffffff' }}
                                >
                                    <Header
                                        siteTitle={data.site.siteMetadata.title}
                                        onPostPage={onPostPage}
                                        isBlogArticlePage={isBlogArticlePage}
                                        isHomePage={isHomePage}
                                    />
                                    {onPostPage && !isBlogArticlePage && (!anchorHide || !sidebarHide) && (
                                        <span className="display-mobile">
                                            <ResponsiveTopBar />
                                        </span>
                                    )}
                                    {isBlogArticlePage && (
                                        <div className="blogHeaderTitle display-desktop">
                                            <h1>{pageTitle}</h1>
                                        </div>
                                    )}
                                </AntdLayout.Header>

                                {onPostPage &&
                                    (!isBlogArticlePage ? (
                                        <div className="post-page-sub-header">
                                            <div className="post-page-sub-header-inner">
                                                <span style={{ paddingRight: isDocsPage ? 5 : 30 }}>
                                                    <DarkModeToggle />
                                                </span>
                                                {isDocsPage && <DocsSearch />}
                                            </div>
                                        </div>
                                    ) : (
                                        <Spacer onlyDesktop={true} />
                                    ))}

                                {/* content */}
                                <AntdLayout
                                    className={
                                        'layout ' +
                                        (onPostPage ? 'docsPageLayout ' : 'notDocsLayout ') +
                                        (isBlogArticlePage ? 'blogPageLayout ' : '') +
                                        (isDocsPage && 'docs-only-layout')
                                    }
                                    id={onPostPage ? 'docs-content-wrapper' : ''}
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    <AntdLayout.Content>
                                        {isBlogArticlePage && (
                                            <div className="display-mobile">
                                                <h1>{pageTitle}</h1>
                                                <br />
                                            </div>
                                        )}
                                        <Container
                                            onPostPage={onPostPage}
                                            className={className + ' container'}
                                            containerStyle={containerStyle}
                                        >
                                            {children}
                                        </Container>
                                    </AntdLayout.Content>

                                    {/* Sidebar right */}
                                    {onPostPage && !anchorHide && (
                                        <AntdLayout.Sider
                                            className="rightBar display-desktop"
                                            id="right-navbar"
                                            style={{ background: '#ffffff' }}
                                        >
                                            <ResponsiveAnchor />
                                        </AntdLayout.Sider>
                                    )}
                                </AntdLayout>
                            </AntdLayout>
                        </AntdLayout>
                        <AntdLayout style={{ background: '#ffffff' }}>
                            {isBlogArticlePage && <NewsletterForm />}
                            <Footer onPostPage={onPostPage} />
                        </AntdLayout>
                        {showAnnouncement ? (
                            <Link
                                to="/blog/posthog-announces-9-million-dollar-series-A"
                                onClick={(e) => stopAnnouncement(e, 'link')}
                            >
                                <div className="announcement-banner">
                                    <p className="centered announcement-text">
                                        PostHog Raises $9 Million Series A
                                        <CloseOutlined
                                            className="announcement-banner-close"
                                            onClick={(e) => stopAnnouncement(e, 'close')}
                                        />
                                    </p>
                                </div>
                            </Link>
                        ) : null}
                    </>
                )
            }}
        />
    )
}

export default Layout
