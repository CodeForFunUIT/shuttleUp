import 'package:flutter_test/flutter_test.dart';
import 'package:shuttleup_mobile/app/app.dart';
import 'package:shuttleup_mobile/app/di/injection.dart';
import 'package:shuttleup_mobile/features/session/presentation/bloc/session_bloc.dart';

import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUpAll(() async {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({});
    if (!getIt.isRegistered<SessionBloc>()) {
      await configureDependencies();
    }
  });

  testWidgets('App smoke test - initializes ShuttleUpApp', (WidgetTester tester) async {
    await tester.pumpWidget(const ShuttleUpApp());
    await tester.pump(const Duration(seconds: 2));

    expect(find.byType(ShuttleUpApp), findsOneWidget);
  });
}
