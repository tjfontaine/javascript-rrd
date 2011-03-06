
Name: javascriptrrd
Version: 0.5.0
Release: 2
Summary: A package to render RRD databases in javascript using Flot

Group: Amusements/Graphics
License: MIT
Source0: %{name}-%{version}.tar.gz
BuildArch: noarch
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

%description

%prep
%setup -q

%build

%install
install -m 755 -d $RPM_BUILD_ROOT/%{_datadir}/javascriptrrd/js
install -m 644 src/lib/*.js $RPM_BUILD_ROOT/%{_datadir}/javascriptrrd/js
install -m 755 -d $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd
install -m 755 -d $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/rrds
install -m 644 data/example_rrds/*.rrd $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/rrds/
install -m 644 doc/*.txt $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/
install -m 755 -d $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/html
install -m 644 doc/lib/*.html $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/html
install -m 755 -d $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/example_site
install -m 644 src/examples/*.html $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/example_site

# Include flot as well
install -m 755 -d $RPM_BUILD_ROOT/%{_datadir}/javascriptrrd/flot
install -m 644 flot/*.js $RPM_BUILD_ROOT/%{_datadir}/javascriptrrd/flot
install -m 755 -d $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/flot
install -m 644 flot/*.txt $RPM_BUILD_ROOT/%{_defaultdocdir}/javascriptrrd/flot


%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,nobody,nobody,-)
%{_defaultdocdir}/javascriptrrd/*
%{_datadir}/javascriptrrd/js/*.js
%{_datadir}/javascriptrrd/flot/*.js
%{_defaultdocdir}/javascriptrrd/flot

%changelog
* Thu Jun 3 2010 Derek Weitzel <dweitzel@cse.unl.edu> 0.5.0-2
Added flot to the install as well


